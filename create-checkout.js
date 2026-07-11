// Ficheiro: api/create-checkout.js
// Este código corre de forma segura no servidor (Vercel/Netlify)

// Importar o SDK do Stripe (Iremos instalar isto depois)
const stripe = require('stripe')('A_SUA_CHAVE_SECRETA_DO_STRIPE_AQUI');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { gateway, productName } = req.body;

    try {
        if (gateway === 'Credit Card (Stripe)') {
            // Cria a sessão de pagamento no Stripe
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: productName,
                        },
                        unit_amount: 9900, // Preço em cêntimos (ex: $99.00). Teremos de passar o valor real do produto depois!
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                // A magia do Passo 2 (Entrega) acontece aqui: 
                // Se o pagamento for bem-sucedido, o Stripe redireciona para a página de sucesso
                success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/vault.html`,
            });

            return res.status(200).json({ url: session.url });
        } 
        
        else if (gateway === 'PayPal') {
            // Lógica da API do PayPal entrará aqui
            return res.status(200).json({ url: '#' }); 
        }

        else if (gateway === 'Binance Pay') {
            // Lógica da API do Binance entrará aqui
            return res.status(200).json({ url: '#' });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Erro ao processar o gateway de pagamento.' });
    }
}
