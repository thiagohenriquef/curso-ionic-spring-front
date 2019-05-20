import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Item, LoadingController } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { CategoriaService } from '../../services/domain/categoria.service';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items : ProdutoDTO[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public produtoService : ProdutoService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    const loader = this.presentLoading();
    this.produtoService.findByCategoria(this.navParams.get('categoria_id'))
      .subscribe(resp => {
        this.items = resp['content'];
        loader.dismiss();
        this.updateImages();
      }, error => {
        loader.dismiss();
      })
  }

  public updateImages() {
    this.items.forEach(el => {
      this.produtoService.getSmallImageFromBucket(el.id)
        .subscribe(resp => {
          el.imageURL = `${API_CONFIG.bucketBaseUrl}/prod${el.id}-small.jpg`;
        }, error => {});
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
}
