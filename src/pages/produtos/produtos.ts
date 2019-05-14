import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { CategoriaService } from '../../services/domain/categoria.service';
import { ProdutoService } from '../../services/domain/produto.service';
import { ToggleGesture } from 'ionic-angular/umd/components/toggle/toggle-gesture';
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
    public produtoService : ProdutoService) {
  }

  ionViewDidLoad() {
    this.produtoService.findByCategoria(this.navParams.get('categoria_id'))
      .subscribe(resp => {
        this.items = resp['content'];
        this.updateImages();
      }, error => {})
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

}
