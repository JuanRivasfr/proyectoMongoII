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

    templatesCompraRealizadaBoletas(msg, precioTotal, usuarioId, funcionId, asientos){
        return {
            status: 200,
            message: msg,
            precioTotal : precioTotal,
            idUsuario : usuarioId,
            funcionId : funcionId,
            asientos : asientos
        }
    }

}