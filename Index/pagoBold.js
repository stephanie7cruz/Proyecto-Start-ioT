document.getElementById('boldPaymentButton').addEventListener('click', () => {
    const totalElement = document.getElementById('total-a-pagar');
    const totalText = totalElement.textContent.replace(/[^0-9.]/g, ''); // Elimina símbolos y deja solo números
    const totalAmount = parseFloat(totalText);

    // Configuración del pago con Bold Commerce
    BoldCheckout.open({
        order: {
            amount: totalAmount * 100, // El monto debe estar en centavos
            currency: 'USD',
            description: 'Pago de productos'
        },
        metadata: {
            secret_key: 'IY2KrJpQ6LfBYoy3T5GzVA'
        }
    });
});