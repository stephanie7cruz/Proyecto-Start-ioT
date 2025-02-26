document.addEventListener('DOMContentLoaded', () => {
    const boldButton = document.getElementById('boldPaymentButton');
    if (boldButton) {
        boldButton.addEventListener('click', () => {
            const totalElement = document.getElementById('total-a-pagar');
            const totalText = totalElement.textContent.replace(/[^0-9.]/g, '');
            const totalAmount = parseFloat(totalText);

            if (isNaN(totalAmount) || totalAmount <= 0) {
                alert('El monto a pagar no es válido.');
                return;
            }

            BoldCheckout.configure({
                order: {
                    amount: totalAmount,
                    currency: 'COP',
                    description: 'Pago de productos en carrito'
                },
                metadata: {
                    secret_key: 'xC51qQgSC-8U5NcNceFPkw'
                }
            });
        });
    } else {
        console.error('No se encontró el botón de pago.');
    }
});
