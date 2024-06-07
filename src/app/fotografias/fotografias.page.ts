import { Component, OnInit, OnDestroy } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoService } from '../services/photo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fotografias',
  templateUrl: './fotografias.page.html',
  styleUrls: ['./fotografias.page.scss'],
})
export class FotografiasPage implements OnInit, OnDestroy {
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

      if (image.webPath) {
        this.photos.push(image.webPath);
      } else {
        console.error('No se pudo obtener el path de la imagen.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  openImage(photo: string) {
    const modal = document.getElementById('imageModal') as HTMLDivElement;
    const modalImg = document.getElementById('modalImage') as HTMLImageElement;
    modal.style.display = 'block';
    modalImg.src = photo;
  }

  closeImage() {
    const modal = document.getElementById('imageModal') as HTMLDivElement;
    modal.style.display = 'none';
  }
}
