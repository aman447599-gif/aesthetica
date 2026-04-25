// DOM Elements
const textInput = document.getElementById('text-input');
const fontSelector = document.getElementById('font-selector');
const textColorPicker = document.getElementById('text-color');
const bgColorPicker = document.getElementById('bg-color');
const textColorIndicator = document.getElementById('text-color-indicator');
const bgColorIndicator = document.getElementById('bg-color-indicator');

const previewText = document.getElementById('preview-text');
const wallpaperPreview = document.getElementById('wallpaper-preview');

const styleBtns = document.querySelectorAll('.style-btn');
const btnGenerate = document.getElementById('btn-generate');
const btnDownload = document.getElementById('btn-download');
const btnUnlockPremium = document.getElementById('btn-unlock-premium');
const btnShare = document.getElementById('btn-share');

const premiumModal = document.getElementById('premium-modal');
const closeBtn = document.querySelector('.close-modal');
const codeInput = document.getElementById('premium-code-input');
const btnActivate = document.getElementById('btn-activate');
const btnBuyNow = document.getElementById('btn-buy-now');
const codeStatusMsg = document.getElementById('code-status-msg');
const toast = document.getElementById('toast');

// State
let isPremium = localStorage.getItem('aesthetica_premium') === 'true';

// Constants
const FREE_STYLES = ['style-minimal-dark', 'style-soft-gradient', 'style-clean-white'];
const PREMIUM_STYLES = ['style-glass-neon', 'style-cyberpunk', 'style-anime', 'style-luxury'];
const ALL_STYLES = [...FREE_STYLES, ...PREMIUM_STYLES];
const FONTS = ['font-minimal', 'font-bold', 'font-script', 'font-neon'];
const RANDOM_TEXTS = ["Vibes", "Aesthetic", "Chill", "Dreamer", "Neon", "Midnight", "Ethereal", "Serenity"];

// Initialization
function init() {
    checkPremiumStatus();
    updatePreviewText();
    updatePreviewFont();
    updateColors();
    
    // Event Listeners
    textInput.addEventListener('input', updatePreviewText);
    fontSelector.addEventListener('change', updatePreviewFont);
    
    textColorPicker.addEventListener('input', updateColors);
    bgColorPicker.addEventListener('input', updateColors);
    
    styleBtns.forEach(btn => {
        btn.addEventListener('click', () => handleStyleClick(btn));
    });
    
    btnGenerate.addEventListener('click', generateRandom);
    btnDownload.addEventListener('click', downloadWallpaper);
    btnShare.addEventListener('click', shareApp);
    
    // Modal Listeners
    btnUnlockPremium.addEventListener('click', () => openModal());
    closeBtn.addEventListener('click', closeModal);
    premiumModal.addEventListener('click', (e) => {
        if (e.target === premiumModal) closeModal();
    });
    
    btnActivate.addEventListener('click', activatePremiumCode);
    btnBuyNow.addEventListener('click', simulatePayment);
    
    // Add haptic feedback class to buttons when clicked
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.remove('haptic-feedback');
            void this.offsetWidth; // trigger reflow
            this.classList.add('haptic-feedback');
        });
    });
}

// Live Preview Functions
function updatePreviewText() {
    previewText.textContent = textInput.value || ' ';
}

function updatePreviewFont() {
    // Remove old font classes
    FONTS.forEach(font => previewText.classList.remove(font));
    // Add new font class
    previewText.classList.add(fontSelector.value);
}

function updateColors() {
    const tColor = textColorPicker.value;
    const bColor = bgColorPicker.value;
    
    previewText.style.color = tColor;
    textColorIndicator.style.backgroundColor = tColor;
    
    // Background color only applies if not overridden by style class
    const currentStyle = Array.from(styleBtns).find(btn => btn.classList.contains('active')).dataset.style;
    if (FREE_STYLES.includes(currentStyle) || isPremium) {
       wallpaperPreview.style.backgroundColor = bColor;
    }
    bgColorIndicator.style.backgroundColor = bColor;
}

function handleStyleClick(btn) {
    const styleName = btn.dataset.style;
    
    if (PREMIUM_STYLES.includes(styleName) && !isPremium) {
        openModal();
        return;
    }
    
    // Remove active class from all
    styleBtns.forEach(b => b.classList.remove('active'));
    // Add active class to clicked
    btn.classList.add('active');
    
    // Apply style to preview
    ALL_STYLES.forEach(style => wallpaperPreview.classList.remove(style));
    wallpaperPreview.classList.add(styleName);
    
    // Reset background color from picker if a theme is applied
    // Themes usually override background, but clean white can use it
    if(styleName !== 'style-clean-white' && styleName !== 'style-minimal-dark'){
        wallpaperPreview.style.backgroundColor = '';
    } else {
        wallpaperPreview.style.backgroundColor = bgColorPicker.value;
    }
}

// Premium System
function checkPremiumStatus() {
    if (isPremium) {
        // Unlock premium UI
        styleBtns.forEach(btn => {
            if (PREMIUM_STYLES.includes(btn.dataset.style)) {
                btn.classList.remove('premium-locked');
                btn.classList.add('premium-unlocked');
            }
        });
        btnUnlockPremium.style.display = 'none';
    }
}

function activatePremiumCode() {
    const code = codeInput.value.trim().toUpperCase();
    if (code === 'AESTHETICA49') {
        localStorage.setItem('aesthetica_premium', 'true');
        isPremium = true;
        
        codeStatusMsg.textContent = 'Premium Unlocked Successfully! ✨';
        codeStatusMsg.className = 'status-msg success';
        
        checkPremiumStatus();
        showToast('Premium styles unlocked!');
        
        setTimeout(() => {
            closeModal();
            codeStatusMsg.textContent = '';
        }, 1500);
    } else {
        codeStatusMsg.textContent = 'Invalid Code. Try again.';
        codeStatusMsg.className = 'status-msg error';
    }
}

function simulatePayment() {
    btnBuyNow.innerHTML = '<span class="loading">Processing...</span>';
    btnBuyNow.disabled = true;
    
    setTimeout(() => {
        btnBuyNow.innerHTML = 'Buy Now';
        btnBuyNow.disabled = false;
        
        // Auto fill code for demo purposes
        codeInput.value = 'AESTHETICA49';
        showToast('Payment simulated! Use code: AESTHETICA49');
    }, 1500);
}

// Modals
function openModal() {
    premiumModal.classList.remove('hidden');
}

function closeModal() {
    premiumModal.classList.add('hidden');
}

// Actions
function generateRandom() {
    // Random Text
    const rText = RANDOM_TEXTS[Math.floor(Math.random() * RANDOM_TEXTS.length)];
    textInput.value = rText;
    updatePreviewText();
    
    // Random Font
    const rFont = FONTS[Math.floor(Math.random() * FONTS.length)];
    fontSelector.value = rFont;
    updatePreviewFont();
    
    // Random Colors
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    textColorPicker.value = randomColor();
    bgColorPicker.value = randomColor();
    updateColors();
    
    // Random Style
    const availableStyles = isPremium ? ALL_STYLES : FREE_STYLES;
    const rStyle = availableStyles[Math.floor(Math.random() * availableStyles.length)];
    const styleBtn = Array.from(styleBtns).find(btn => btn.dataset.style === rStyle);
    if(styleBtn) handleStyleClick(styleBtn);
    
    showToast('Randomized ✨');
}

async function downloadWallpaper() {
    try {
        const originalText = btnDownload.innerHTML;
        btnDownload.innerHTML = 'Rendering...';
        btnDownload.disabled = true;
        
        // Wait for rendering
        const canvas = await html2canvas(wallpaperPreview, {
            scale: 3, // High quality
            useCORS: true,
            backgroundColor: null,
            logging: false
        });
        
        const link = document.createElement('a');
        link.download = `Aesthetica_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showToast('Wallpaper Downloaded! 🖼️');
        
        btnDownload.innerHTML = originalText;
        btnDownload.disabled = false;
    } catch (error) {
        console.error("Error generating image:", error);
        showToast('Failed to download image');
        btnDownload.disabled = false;
    }
}

function shareApp() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard! 📋');
    }).catch(() => {
        showToast('Unable to copy link.');
    });
}

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Boot up
document.addEventListener('DOMContentLoaded', init);
