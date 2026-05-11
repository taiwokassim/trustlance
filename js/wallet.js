/**
 * Zegel/VatGate Unified Wallet Adapter
 * Supports: Phantom & Backpack
 */

const ZegelWallet = {
    provider: null,
    address: null,

    // 1. Unified Detection
    async findProvider() {
        // This order checks for Backpack first, then Phantom, then generic
        const provider = window.backpack?.solana || window.phantom?.solana || window.solana;

        if (provider) {
            this.provider = provider;
            const name = provider.isBackpack ? "Backpack" : (provider.isPhantom ? "Phantom" : "Solana Wallet");
            console.log(`✅ ${name} detected.`);
            return provider;
        }

        return null;
    },

    // 2. Single Connect Function for both
    async connect() {
        const provider = await this.findProvider();
        
        if (!provider) {
            alert("No wallet found. Please install Phantom or Backpack.");
            window.open("https://phantom.app/", "_blank");
            return;
        }

        try {
            // Standard Solana connect call works for both
            const resp = await provider.connect();
            this.address = resp.publicKey.toString();
            
            // UI Updates
            localStorage.setItem("zegel_wallet", this.address);
            this.updateDisplay(this.address);
            
            console.log("Connected with:", this.address);

            // Optional: If you still need to save to your PHP backend
            if (typeof saveWallet === "function") {
                await saveWallet(this.address);
            }

        } catch (err) {
            console.warn("Connection cancelled by user.");
        }
    },

    updateDisplay(addr) {
        const walletEl = document.getElementById("wallet");
        const btn = document.getElementById("phantomConnectBtn"); // Using your button ID
        
        const displayStr = addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : "Connect Wallet";
        
        if (walletEl) walletEl.innerText = addr ? addr : "Not Connected";
        if (btn) btn.innerText = displayStr;
    },

    async autoConnect() {
        const saved = localStorage.getItem("zegel_wallet");
        if (saved) {
            const provider = await this.findProvider();
            if (provider) {
                try {
                    const resp = await provider.connect({ onlyIfTrusted: true });
                    this.address = resp.publicKey.toString();
                    this.updateDisplay(this.address);
                } catch (e) {
                    localStorage.removeItem("zegel_wallet");
                }
            }
        }
    }
};

//window.addEventListener('load', () => ZegelWallet.autoConnect());