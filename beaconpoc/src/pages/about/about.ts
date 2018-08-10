import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { IBeacon } from '@ionic-native/ibeacon';
import { 
  File, 
  // FileEntry 
} from '@ionic-native/file';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  private beacons = [
    { id: '0', name: 'Initialized!' },
  ];

  private beaconRegion;

  constructor(
    public navCtrl: NavController,
    private ibeacon: IBeacon,
    private file: File,
    private alertCtrl: AlertController
  ) {

    this.beacons.push({ id: new Date().toLocaleString(), name: 'Press buttom to start monitoring beacons' })
    this.logContentToFile(new Date().toLocaleString() + 'Constructed');
    this.createFolder();
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

  registerMonitoring() {


    this.beacons.push({ id: new Date().toLocaleString(), name: 'Searching for beacons..' })

    this.logContentToFile(new Date().toLocaleString() + 'Registrando eventos..');
    // Request permission to use location on iOS
    this.ibeacon.requestAlwaysAuthorization();
    // create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();

    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion()
      .subscribe(
        data => {
          this.beacons.push({ id: new Date().toLocaleString(), name: 'didRangeBeaconsInRegion' })
          console.log('didRangeBeaconsInRegion: ', data)
          this.logContentToFile(new Date().toLocaleString() + 'didRangeBeaconsInRegion:');
          this.logContentToFile(JSON.stringify(data));
        },
        error => {
          const alert = this.alertCtrl.create({
            title: 'ERROR!',
            subTitle: error,
            buttons: ['OK']
          });
          alert.present();
          console.log(error);
        }
      );
    delegate.didStartMonitoringForRegion()
      .subscribe(
        data => {
          this.beacons.push({ id: new Date().toLocaleString(), name: 'didStartMonitoringForRegion' })
          console.log('didStartMonitoringForRegion: ', data)
          
          this.logContentToFile(new Date().toLocaleString() + 'didStartMonitoringForRegion:');
          this.logContentToFile(JSON.stringify(data));
        },
        error => {
          const alert = this.alertCtrl.create({
            title: 'ERROR!',
            subTitle: error,
            buttons: ['OK']
          });
          alert.present();
          console.log(error);
        }
      );
    delegate.didExitRegion()
      .subscribe(
        data => {
          this.beacons.push({ id: new Date().toLocaleString(), name: 'didExitRegion' })
          console.log('didExitRegion: ', data)
          this.logContentToFile(new Date().toLocaleString() + 'didExitRegion:');
          this.logContentToFile(JSON.stringify(data));
        },
        error => {
          const alert = this.alertCtrl.create({
            title: 'ERROR!',
            subTitle: error,
            buttons: ['OK']
          });
          alert.present();
          console.log(error);
        }
      );

    delegate.didEnterRegion()
      .subscribe(
        data => {
          this.beacons.push({ id: new Date().toLocaleString(), name: 'didEnterRegion: ' + data.region.identifier })
          console.log('didEnterRegion: ', data);
          this.logContentToFile(new Date().toLocaleString() + 'didEnterRegion:');
          this.logContentToFile(JSON.stringify(data));
        },
        error => {
          const alert = this.alertCtrl.create({
            title: 'ERROR!',
            subTitle: error,
            buttons: ['OK']
          });
          alert.present();
          console.log(error);
        }
      );
  };

  startMonitoring() {

    // enableDebugNotifications / enableDebugLogs / appendToDeviceLog
    this.ibeacon.enableDebugNotifications()
    .then(
      data => {
        const alert = this.alertCtrl.create({
          title: 'LOG NOTIFICATIONS ENABLED',
          subTitle: JSON.stringify(data),
          buttons: ['OK']
        });
        alert.present();
      }
    )
    this.ibeacon.enableDebugLogs()
    .then(
      data => {
        const alert = this.alertCtrl.create({
          title: 'LOG ENABLED',
          subTitle: JSON.stringify(data),
          buttons: ['OK']
        });
        alert.present();
      }
    )

    this.beaconRegion = this.ibeacon.BeaconRegion('F9:FD:09:FB:B5:6D', 'b9407f30-f5f8-466e-aff9-25556b57fe6d', 46445, 2555);

    this.ibeacon.startMonitoringForRegion(this.beaconRegion)
      .then(
        data => {
          this.beacons.push({ id: new Date().toLocaleString(), name: 'Native layer recieved the request to monitoring' })
          console.log('Native layer recieved the request to monitoring:');
          console.log(data);
          this.logContentToFile(new Date().toLocaleString() + 'STARTED MONITORING:');
          this.logContentToFile(JSON.stringify(data));
        },
        error => {
          this.beacons.push({ id: new Date().toLocaleString(), name: 'Native layer failed to begin monitoring:' })
          console.error('Native layer failed to begin monitoring: ', error)
          this.logContentToFile(new Date().toLocaleString() + 'ERROR MONITORING:');
          this.logContentToFile(JSON.stringify(error));
        }
      );
  }

  stopMonitoring() {
    this.ibeacon.stopMonitoringForRegion(this.beaconRegion)
      .then(
        data => {
          this.beacons.push({ id: new Date().toLocaleString(), name: 'Native layer recieved the request to STOP monitoring' })
          console.log('Native layer recieved the request to STOP monitoring');
          console.log(data);
          this.logContentToFile(new Date().toLocaleString() + 'STOPED MONITORING:');
          this.logContentToFile(JSON.stringify(data));
        },
        error => {
          this.beacons.push({ id: new Date().toLocaleString(), name: 'Native layer failed to begin STOP monitoring:' })
          console.error('Native layer failed to begin STOP monitoring: ', error)
        }
      );
  }

  // NAO FUNCIONA PARA O ANDROID
  // showRegionState() {
  //   this.ibeacon.requestStateForRegion(this.beaconRegion)
  //   .then(
  //     data => {
  //       this.beacons.push({ id: new Date().toLocaleString(), name: 'Native layer recieved the request to STOP monitoring' })
  //       console.log('Native layer recieved the request to STOP monitoring');
  //       console.log(data);
  //     },
  //     error => {
  //       this.beacons.push({ id: new Date().toLocaleString(), name: 'Native layer failed to begin STOP monitoring:' })
  //       console.error('Native layer failed to begin STOP monitoring: ', error)
  //     }
  //   );
  // }


  getAuthorization() {
    this.ibeacon.getAuthorizationStatus()
      .then(
        data => {
          this.beacons.push({ id: new Date().toLocaleString(), name: 'getAuthorizationStatus' })
          console.log('getAuthorizationStatus:');
          console.log(data);
          if(data.authorizationStatus == "AuthorizationStatusAuthorized"){
            console.log('authorized!!');
          }
        },
        error => {
          this.beacons.push({ id: new Date().toLocaleString(), name: 'Native layer failed to begin STOP monitoring:' })
          console.error('ERROR ON GETTING AUTHORIZATION STATUS ', error)
        }
      );
  }

}
