// ==========================================================================
// VERTEX ASSET DATABASE (PRICED IN USD FOR GLOBAL MARKET)
// ==========================================================================
const vaultAssets = [
    { id: "comp-1", type: "component", title: "Animated Beam Button", desc: "Border-glow interactive button running variable conic-gradients at flawless 60fps.", price: "$15" },
    { id: "comp-2", type: "component", title: "Glassmorphism Sidebar Menu", desc: "Ultra-smooth overlay sliding navigation architecture with real-time backdrop blur filtration.", price: "$29" },
    { id: "comp-3", type: "component", title: "Cinematic WebGL Physics Hero", desc: "Interactive mathematical node connection mesh canvas engine optimized completely for mobile.", price: "$49" },
    { id: "site-1", type: "website", title: "Aether FinTech Dashboard Template", desc: "Minimalist dark financial user interface optimized for high data density and zero animation latency.", price: "$149" },
    { id: "site-2", type: "website", title: "Riyadh Luxury Architecture Single", desc: "Premium property showcase display network styled using high-end cinematic chiaroscuro guidelines.", price: "$119" },
    { id: "site-3", type: "website", title: "Zenith Conversion SaaS Engine", desc: "Conversion-optimized landing deck vector stack completely prepared for fast manual checkouts.", price: "$99" },
    { id: "site-4", type: "website", title: "Vanguard Creative Agency Slate", desc: "Immersive multi-axis design portfolio framework crafted exclusively for top-tier creative studios.", price: "$129" },
    { id: "site-5", type: "website", title: "Chronos Haute Horlogerie Lounge", desc: "High-contrast retail experience built with geometric luxury panels and fluid product viewport states.", price: "$139" },
    { id: "site-6", type: "website", title: "Helios Decentralized Crypto Wrapper", desc: "Clean Web3 exchange landing interface featuring native real-time graphical simulation models.", price: "$179" },
    { id: "site-7", type: "website", title: "Omni Global Logistics Platform", desc: "High conversion operational landing grid engineered for seamless execution across digital devices.", price: "$109" },
    { id: "site-8", type: "website", title: "Apex Autonomous Cybernetic Studio", desc: "Industrial software layout leveraging raw Space-Grotesk typographical rules and raw performance.", price: "$89" },
    { id: "site-9", type: "website", title: "Elysium Private Healthcare Core", desc: "Sober, high-end medical consultancy framework focusing on clear, trusted patient acquisition models.", price: "$115" },
    { id: "site-10", type: "website", title: "Nexus E-Commerce Conversion Deck", desc: "Highly customizable localized shopping framework designed to integrate global payment structures.", price: "$159" },
    { id: "site-11", type: "website", title: "Aura Premium Aesthetics Matrix", desc: "Ultra luxury cosmetic product design framework layout focused completely on quick market validations.", price: "$125" },
    { id: "site-12", type: "website", title: "Titan Engineering Core Portal", desc: "Brutalist clean industry matrix engineered to communicate extreme operational power and scale.", price: "$135" },
    { id: "site-13", type: "website", title: "Cipher Cloud Security Layer Site", desc: "High-fidelity modern layout built using deep defensive glowing accents and secure glass frames.", price: "$145" },
    { id: "site-14", type: "website", title: "Solaria Clean Infrastructure Engine", desc: "Futuristic sustainable energy portfolio system focusing heavily on interactive text mechanics.", price: "$95" },
    { id: "site-15", type: "website", title: "Veritas Corporate Legal Trust Link", desc: "Razor-sharp, prestigious corporate layout crafted specifically to project unmatched authority.", price: "$120" },
    { id: "site-16", type: "website", title: "Krypton Web3 Native Staking Matrix", desc: "Advanced single page deck with complex reactive blocks fully prepared for asset distribution.", price: "$169" },
    { id: "site-17", type: "website", title: "Prism Global Esports Broadcast Hub", desc: "High adrenaline media ecosystem optimized for responsive live streams and lightning-fast media loading.", price: "$110" }
];

// ==========================================================================
// RENDERIZADOR DINÂMICO DE PRODUTOS
// ==========================================================================
const grid = document.getElementById('market-products-grid');

function renderAssets(assetsToRender) {
    if (!grid) return;
    grid.innerHTML = ""; 
    
    assetsToRender.forEach(asset => {
        const badgeText = asset.type === 'website' ? 'Full Website' : 'UI Component';
        
        const cardHTML = `
            <div class="market-card" data-type="${asset.type}">
                <div class="card-preview-container">
                    <span class="asset-badge">${badgeText}</span>
                </div>
                <div class="card-meta">
                    <h3>${asset.title}</h3>
                    <p>${asset.desc}</p>
                    <div class="card-footer">
                        <div>
                            <span class="card-price">${asset.price}</span>
                            <span style="display: block; font-size: 10px; color: rgba(255,255,255,0.4); font-family: var(--display); letter-spacing: 0.05em; text-transform: uppercase; margin-top: 4px;">Code Source Only</span>
                        </div>
                        <button class="btn-action-buy" onclick="openVaultCheckout('${asset.title}', '${asset.price}')">Get Access</button>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += cardHTML;
    });

    // Chama o motor 3D Global e aplica aos novos cartões que acabaram de nascer
    if (typeof init3DEngine === "function") {
        init3DEngine('.market-card');
    }
}

// ==========================================================================
// INICIALIZADOR COM SKELETON LOADER CINEMATOGRÁFICO
// ==========================================================================
function showVaultSkeletons() {
    if (!grid) return;
    
    // Gera 6 cartões fantasmas elegantes idênticos à sua estrutura real
    grid.innerHTML = Array(6).fill().map(() => `
        <div class="market-card skeleton-card">
            <div class="card-preview-container skeleton-shimmer"></div>
            <div class="card-meta">
                <div class="skeleton-line title skeleton-shimmer"></div>
                <div class="skeleton-line desc skeleton-shimmer"></div>
                <div class="skeleton-line desc short skeleton-shimmer"></div>
                <div class="card-footer" style="border-top: 1px solid rgba(255,255,255,0.03); padding-top: 18px; margin-top: 20px;">
                    <div class="skeleton-line price skeleton-shimmer"></div>
                    <div class="skeleton-button skeleton-shimmer"></div>
                </div>
            </div>
        </div>
    `).join('');
}

// 1. Mostra imediatamente as estruturas pulsantes douradas ao carregar a página
showVaultSkeletons();

// 2. Aguarda 1.2 segundos (tempo de resposta premium) e faz o "reveal" dos dados reais
setTimeout(() => {
    renderAssets(vaultAssets); // A sua linha antiga volta aqui, mas com atraso programado!
}, 1200);


// ==========================================================================
// MOTOR DE FILTROS E PESQUISA INTERNACIONAL
// ==========================================================================
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('vault-search');
let activeFilter = 'all';

function applyFiltersAndSearch() {
    const filtered = vaultAssets.filter(asset => {
        const matchesFilter = (activeFilter === 'all' || asset.type === activeFilter);
        const matchesSearch = asset.title.toLowerCase().includes(searchInput.value.toLowerCase()) || 
                              asset.desc.toLowerCase().includes(searchInput.value.toLowerCase());
        return matchesFilter && matchesSearch;
    });
    renderAssets(filtered);
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');
        applyFiltersAndSearch();
    });
});

if (searchInput) {
    searchInput.addEventListener('input', applyFiltersAndSearch);
}

// ==========================================================================
// ENGINE DO INTERFACES DE CHECKOUT
// ==========================================================================
const modal = document.getElementById('vaultCheckoutModal');
const itemDetailsText = document.getElementById('modal-item-details');

window.openVaultCheckout = function(name, price) {
    if (modal) {
        itemDetailsText.textContent = `${name} — Global License Value: ${price} USD`;
        modal.classList.add('active');
    }
};

window.closeVaultCheckout = function() {
    if (modal) modal.classList.remove('active');
};

window.switchPaymentMethod = function(methodId) {
    const tabButtons = document.querySelectorAll('.pay-tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    const contents = document.querySelectorAll('.payment-gateway-content');
    contents.forEach(content => content.classList.remove('active'));
    document.getElementById(`gate-${methodId}`).classList.add('active');
};

// ==========================================================================
// ENGINE DE CHECKOUT REAL (COMUNICAÇÃO COM BACKEND SERVERLESS)
// ==========================================================================
window.processManualSale = async function(gatewayName) {
    const submitBtn = event.target;
    const originalText = submitBtn.innerText;
    const itemName = document.getElementById('modal-item-details').innerText.split(' — ')[0];
    
    // Animação de carregamento no botão
    submitBtn.innerText = 'Iniciando portal seguro...';
    submitBtn.style.opacity = '0.7';
    submitBtn.style.pointerEvents = 'none';

    try {
        // Onde a magia acontece: chamamos a nossa função invisível na nuvem
        const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                gateway: gatewayName,
                productName: itemName
            })
        });

        const data = await response.json();

        if (data.url) {
            // Redireciona o utilizador para o portal seguro do Stripe, PayPal ou Binance
            window.location.href = data.url;
        } else {
            throw new Error('Falha ao gerar link de pagamento.');
        }

    } catch (error) {
        console.error("Erro no checkout:", error);
        alert(`Aviso: O portal [${gatewayName}] está a ser configurado. A sua infraestrutura Serverless precisa de ser ativada.`);
        
        // Restaura o botão em caso de erro
        submitBtn.innerText = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.style.pointerEvents = 'auto';
    }
};

