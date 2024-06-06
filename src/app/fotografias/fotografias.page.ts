import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoService } from '../services/photo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fotografias',
  templateUrl: './fotografias.page.html',
  styleUrls: ['./fotografias.page.scss'],
})
export class FotografiasPage implements OnInit {
  public photos: any;
  private imagesSubscription: Subscription | undefined;


  constructor(public imageService: PhotoService) { }

  ngOnInit() {
    this.fetchImages();
    this.imagesSubscription = this.imageService.getImagesObservable().subscribe(images => {
      this.photos = images;
    });
  }

  ngOnDestroy() {
    if (this.imagesSubscription) {
      this.imagesSubscription.unsubscribe();
    }
  }

  async fetchImages() {
    await this.imageService.fetchImages();
  }

  async takePicture() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      });

      // Asegúrate de que image.webPath no sea undefined antes de usarlo.
      if (image.webPath) {
        this.photos.push(image.webPath);
      } else {
        // Manejar la situación, por ejemplo, mostrar un error o un mensaje.
        console.error('No se pudo obtener el path de la imagen.');
      }
    } catch (error) {
      console.error(error);
    }
  }
}
