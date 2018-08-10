import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { 
  File, 
  // FileEntry 
} from '@ionic-native/file';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(
    private file: File,
    // private fileEntry: FileEntry,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {

  }
  
  createFolder() {

    const alert = this.alertCtrl.create({
      title: 'Directory:',
      subTitle: this.file.externalApplicationStorageDirectory,
      buttons: ['OK']
    });
    alert.present();


    this.file.checkDir(this.file.externalApplicationStorageDirectory, 'beaconlog')
      .then(_ => {
        console.log('Directory exists')
        this.createLogFile();
      })
      .catch(err => {
        console.log('Directory doesn\'t exist, creating it...')
        this.file.createDir(this.file.externalApplicationStorageDirectory, 'beaconlog', true)
          .then(
            _ => {
              console.log('Directory created');
              this.createLogFile();
            }
          )
          .catch(
            err => {
              console.error('Could not create directory:', err);
            }
          )
      });

  }

  createLogFile() {
    let logPath = this.file.externalApplicationStorageDirectory + '/beaconlog';
    this.file.checkFile(logPath, 'beacon_log.txt')
      .then(_ => {
        console.log('File beacon_log.txt exists.')
      })
      .catch(err => {
        console.log('File doesn\'t exist, creating it...')
        this.file.createFile(logPath, 'beacon_log.txt', true)
          .then(
            _ => {
              console.log('File created');
            }
          )
          .catch(
            err => {
              console.error('Could not create file:', err);
            }
          )
      });
  }

  logToFile() {
    this.logContentToFile('testing');
    this.logContentToFile('testing2');
  }

  logContentToFile(content: string) {
    let logPath = this.file.externalApplicationStorageDirectory + '/beaconlog';
    this.file.readAsText(logPath, 'beacon_log.txt')
      .then(
        data => {
          console.log('data READ:');
          console.log(data);
          let toBeWritten = data + '\n' + content; 
          this.file.writeExistingFile(logPath,'beacon_log.txt', toBeWritten);
        }
      )
      .catch(
        err => {
          console.error('Could not read file:', err);
        }
      )
  }

}
