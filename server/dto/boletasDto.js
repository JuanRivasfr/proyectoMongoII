module.exports = class boletasDto{
    templatesMostrarBoletas(arg){
        return {
            status: 200,
            data: arg
        }
    }

    templatesErrorBoletas(){
        return {
            status: 404,
            message: "No se pudo realizar la compra"
        }
    }

}