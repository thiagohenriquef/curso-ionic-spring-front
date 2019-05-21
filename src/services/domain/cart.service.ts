import { Injectable } from "@angular/core";
import { StorageService } from "../storage.service";
import { Cart } from "../../models/cart";
import { ProdutoDTO } from "../../models/produto.dto";


@Injectable()
export class CartService {
    constructor(public storage: StorageService) {

    }

    createOrClearCart() : Cart {
        const cart : Cart = {
            itens: []
        }
        this.storage.setCart(cart);
        return cart;
    }

    getCart() : Cart {
        const cart : Cart = this.storage.getCart();
        if (cart == null) {
            this.createOrClearCart();
        }
        return cart;
    }

    addProduto(produto: ProdutoDTO) : Cart {
        const cart = this.getCart();
        let pos;
        if (cart && cart.itens) {
            pos = cart.itens.findIndex(el => el.produto.id == produto.id);
        } else {
            pos = -1;
        }
        if (pos == -1) {
            cart.itens.push({ quantidade: 1, produto: produto});
        }
        this.storage.setCart(cart);
        return cart;
    }

    removeProduto(produto: ProdutoDTO) : Cart {
        const cart = this.getCart();
        let pos;
        if (cart && cart.itens) {
            pos = cart.itens.findIndex(el => el.produto.id == produto.id);
        } else {
            pos = -1;
        }
        if (pos != -1) {
            cart.itens.splice(pos);
        }
        this.storage.setCart(cart);
        return cart;
    }

    increaseQuantity(produto: ProdutoDTO) : Cart {
        const cart = this.getCart();
        let pos;
        if (cart && cart.itens) {
            pos = cart.itens.findIndex(el => el.produto.id == produto.id);
        } else {
            pos = -1;
        }
        if (pos != -1) {
            cart.itens[pos].quantidade++;
        }
        this.storage.setCart(cart);
        return cart;
    }

    decreaseQuantity(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();
        let pos;
        if (cart && cart.itens) {
            pos = cart.itens.findIndex(el => el.produto.id == produto.id);
        } else {
            pos = -1;
        }
        if (pos != -1) {
            cart.itens[pos].quantidade--;
            if (cart.itens[pos].quantidade < 1) {
                cart = this.removeProduto(produto);
            }
        }
        this.storage.setCart(cart);
        return cart;
    }

    total() : number {
        const cart = this.getCart();
        return cart && cart.itens
            ? cart.itens.reduce((acc, curr) => acc + (curr.produto.preco * curr.quantidade), 0)
            : 0
    }
}