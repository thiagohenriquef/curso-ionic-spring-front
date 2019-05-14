import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { ProdutoDTO } from "../../models/produto.dto";
import { Observable } from "rxjs/Rx";


@Injectable()
export class ProdutoService {
    constructor(public http: HttpClient) {

    }

    findById(produtoId : string) : Observable<ProdutoDTO[]> {
        return this.http.get<ProdutoDTO[]>(`${API_CONFIG.baseUrl}/produtos/${produtoId}`);
    }

    findByCategoria(categoriaId : string) : Observable<ProdutoDTO[]> {
        return this.http.get<ProdutoDTO[]>(`${API_CONFIG.baseUrl}/produtos?categorias=${categoriaId}`);
    }

    getSmallImageFromBucket(id: string) : Observable<any> {
        const url = `${API_CONFIG.bucketBaseUrl}/prod${id}-small.jpg`;
        return this.http.get(url, { responseType: 'blob' });
    }

    getImageFromBucket(id: string) : Observable<any> {
        const url = `${API_CONFIG.bucketBaseUrl}/prod${id}.jpg`;
        return this.http.get(url, { responseType: 'blob' });
    }
}