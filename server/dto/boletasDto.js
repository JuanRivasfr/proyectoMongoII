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

    templatesErrorBoleto(){
        return {
            status: 404,
            message: "No se encontro el boleto"
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

    templatesErrorBoletoTipoCompra(){
        return {
            status: 404,
            message: "Los boletos deben ser una reserva no una compra"
        }
    }

    templatesErrorEliminarReserva(){
        return {
            status: 404,
            message: "Ocurrio un error al intentar eliminar la reserva"
        }
    }

    templatesDescuentoRealizado(precioTotal, descuentoAplicado){
        return {
            status: 200,
            precioTotal: precioTotal,
            descuentoAplicado: descuentoAplicado
        }
    }

    templatesError(msg){
        return {
            status: 404,
            msg: msg
        }
    }

}