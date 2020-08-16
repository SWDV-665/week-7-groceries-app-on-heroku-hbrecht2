import { Component } from '@angular/core';
import {NavController} from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { GroceriesServiceService } from '../groceries-service.service';
import { InputDialogService } from '../input-dialog.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  title = 'Groceries';
  items = [];
  errorMessage: string;

  constructor(public navCtrl: NavController, public toastController: ToastController, public alertController: AlertController, public dataService: GroceriesServiceService, public inputDialogService: InputDialogService, public socialSharing: SocialSharing) {
    dataService.dataChanged$.subscribe((dataChanged: boolean)=>{
      this.loadItems();
    });
  }

  ionViewDidLoad(){
    this.loadItems();
  }

  loadItems() {
    this.dataService.getItems()
    .subscribe(
      items => this.items = items,
      error => this.errorMessage = <any>error);
  }

  removeItem(id) {
    this.dataService.removeItem(id);
  }

  async shareItem(item, index) {
    console.log("Sharing Item - ", item, index)
    const toast = await this.toastController.create({
      message: 'Sharing ' + item.name + ' from grocery list...',
      duration: 2000
    });
    toast.present();

    let message = "Grocery Item: " + item.name + "Quantity: " + item.quantity;
    let subject = "Shared via Groceries App";

    this.socialSharing.share(message, subject).then(() => {
      console.log("Shared successfully.")
    }).catch((error) => {
      console.error("Error while sharing ", error);
    });
  }

  async editItem(item, index) {
    console.log("Edit Item - ", item, index)
    const toast = await this.toastController.create({
      message: 'Editing ' + item.name + ' from grocery list...',
      duration: 2000
    });
    toast.present();
    this.inputDialogService.presentPrompt(item, index);
  }

  addItem() {
    console.log("Item added.");
    this.inputDialogService.presentPrompt();
  }
}