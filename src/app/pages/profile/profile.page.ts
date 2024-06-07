import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;
  selectedFile: File | null = null;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
      if (this.user && !this.user.photoURL) {
        this.user.photoURL = 'assets/default-avatar.png'; // URL de la imagen predeterminada
      }
    });
  }

  goToMenu() {
    this.router.navigate(['/menu']);
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 100
    });

    if (image && image.dataUrl) {
      const file = this.dataURLtoFile(image.dataUrl, 'profile_picture.png');
      this.uploadFile(file);
    }
  }

  dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }

  uploadFile(file: File) {
    if (file) {
      const filePath = `profile_pictures/${file.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, file);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.authService.updateProfile(this.user.nombre, url).then(() => {
              this.user.photoURL = url; // Actualizar la URL de la foto de perfil localmente
              console.log('Perfil actualizado exitosamente');
            }).catch(error => {
              console.error('Error al actualizar el perfil', error);
            });
          });
        })
      ).subscribe();
    }
  }

  updateProfile() {
    if (this.selectedFile) {
      this.uploadFile(this.selectedFile);
    } else {
      this.authService.updateProfile(this.user.nombre, this.user.photoURL).then(() => {
        console.log('Perfil actualizado exitosamente');
      }).catch(error => {
        console.error('Error al actualizar el perfil', error);
      });
    }
  }
}
