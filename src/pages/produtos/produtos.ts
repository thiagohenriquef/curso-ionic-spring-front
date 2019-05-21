import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[] = [];
  page: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService : ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData(refresher = null, infiniteScroll = null) {
    const loader = this.presentLoading();
    this.produtoService.findByCategoria(this.navParams.get('categoria_id'), this.page, 10)
      .subscribe(resp => {
        const start = this.items.length;
        this.items = this.items.concat(resp['content']);
        const end = this.items.length - 1;
        loader.dismiss();
        this.updateImages(start, end);
        if (refresher) {
          refresher.complete();
        }
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      }, error => {
        loader.dismiss();
        if (refresher) {
          refresher.complete();
        }
        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      })
  }

  doRefresh(refresher) {
    this.items = [];
    this.page = 0;
    this.loadData(refresher);
  }

  public updateImages(start: number, end: number) {
    for(let i = start; i < end; i++) {
      const item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(resp => {
          item.imageURL = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        }, error => {});
    }
    this.items.forEach(el => {
    })
  }

  public showDetail(produtoId : string) {
    this.navCtrl.push('ProdutoDetailPage', { produtoId });
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: 'Aguarde...'
    });
    loader.present();
    return loader;
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData(null, infiniteScroll);
  }
}
