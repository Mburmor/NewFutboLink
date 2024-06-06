import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { DataService } from './data.service';
import { Photo, Camera, CameraResultType } from '@capacitor/camera';
import { ref, uploadString } from '@angular/fire/storage'
import { finalize } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public images: string[] = [];
  private imagesSubject: Subject<string[]> = new Subject();


  constructor(
    private storage: AngularFireStorage,
    private dataService: DataService
  ) { }

  public async takePicture() {
    let image;

    let b64: string = '';

    image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    })
      .then(async (imagen) => {
        console.log(imagen);
        image = imagen;
        b64 = (await this.readAsBase64(image)).valueOf();
      })
      .catch((error) => {
        console.log(error, 'ERORR?!!!!!!!!!!');
      });


    uploadString(
      ref(this.storage.storage, `${Date.now()}`),
      b64,
      'data_url'
    ).then((snapshot) => {
      console.log('Uploaded a base64 string!', snapshot);
      this.fetchImages();
    });
  }

  private async readAsBase64(photo: Photo): Promise<string> {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

  public async fetchImages(): Promise<void> {
    this.storage.storage.ref().listAll().then(async result => {
      const urlPromises = result.items.map(async (itemRef) => itemRef.getDownloadURL());
      const urls = await Promise.all(urlPromises);
      this.images = urls;
      this.imagesSubject.next(this.images);

      console.log(this.images, 'downloaded URLs');
    }).catch(error => {
      console.error('Error fetching download URLs:', error);
    });
  }

  public getImagesObservable(): Observable<string[]> {
    return this.imagesSubject.asObservable();
  }

}
