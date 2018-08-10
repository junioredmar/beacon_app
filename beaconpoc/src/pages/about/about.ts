import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { IBeacon } from '@ionic-native/ibeacon';

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
    private alertCtrl: AlertController
  ) {

    this.beacons.push({ id: new Date().toLocaleString(), name: 'Press buttom to start monitoring beacons' })
  }

  registerMonitoring() {


    this.beacons.push({ id: new Date().toLocaleString(), name: 'Searching for beacons..' })

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

    this.beaconRegion = this.ibeacon.BeaconRegion('F9:FD:09:FB:B5:6D', 'b9407f30-f5f8-466e-aff9-25556b57fe6d', 46445, 2555);

    this.ibeacon.startMonitoringForRegion(this.beaconRegion)
      .then(
        data => {
          this.beacons.push({ id: new Date().toLocaleString(), name: 'Native layer recieved the request to monitoring' })
          console.log('Native layer recieved the request to monitoring:');
          console.log(data);
        },
        error => {
          this.beacons.push({ id: new Date().toLocaleString(), name: 'Native layer failed to begin monitoring:' })
          console.error('Native layer failed to begin monitoring: ', error)
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
