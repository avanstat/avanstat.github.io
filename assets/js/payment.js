/* ==========================================================================
   AVAN STAT - Payment Portal Interactive Logic (Stripe Direct Checkout)
   ========================================================================== */

// ==========================================
// STRIPE PAYMENT LINK CONFIGURATION
// ==========================================
// Paste your official Stripe Payment Link URL below when created (e.g. "https://buy.stripe.com/your_custom_link")
// If left empty (""), the site will simulate the seamless redirect to your Stripe Checkout page.
const STRIPE_PAYMENT_LINK = ""; 

document.addEventListener('DOMContentLoaded', () => {
    
    // Elements - Calculator
    const optionCards = document.querySelectorAll('.service-option-card');
    const hourlyScaleGroup = document.getElementById('hourly-scale-group');
    const hourCountInput = document.getElementById('hour-count');
    const hoursValueDisplay = document.getElementById('hours-value');
    
    const billBaseNameText = document.getElementById('bill-base-name');
    const billBaseText = document.getElementById('bill-base');
    const billTotalText = document.getElementById('bill-total-price');
    const btnPriceDisplay = document.getElementById('btn-price-display');
    
    // Elements - Form Inputs
    const clientNameInput = document.getElementById('client-name');
    const clientEmailInput = document.getElementById('client-email');
    
    // Elements - Form & Modal
    const paymentForm = document.getElementById('payment-form');
    const processingModal = document.getElementById('processing-modal');
    const spinnerContainer = document.getElementById('spinner-container');
    const modalHeading = document.getElementById('modal-heading');
    const modalSubtext = document.getElementById('modal-subtext');
    
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const step4 = document.getElementById('step-4');
    
    // Elements - Success Section
    const checkoutMain = document.getElementById('checkout-main');
    const successSection = document.getElementById('success-section');
    const invClientName = document.getElementById('inv-client-name');
    const invClientEmail = document.getElementById('inv-client-email');
    const invoiceItems = document.getElementById('invoice-items');
    const invNumberText = document.getElementById('inv-number');
    const invDateText = document.getElementById('inv-date');
    const printBtn = document.getElementById('print-invoice-btn');
    
    // State variables
    let basePrice = 200;
    let totalPrice = 200;
    let selectedPackage = "basic-consult"; // 'basic-consult', 'analysis-viz', 'package', 'consulting'
    let selectedPackageName = "Study Design & Consultation";
    
    // ==========================================
    // 1. DYNAMIC CALCULATOR LOGIC
    // ==========================================
    const updatePrices = () => {
        if (selectedPackage === 'consulting') {
            // Hourly Consulting pricing logic
            hourlyScaleGroup.style.display = 'block';
            
            const hours = parseInt(hourCountInput.value, 10);
            hoursValueDisplay.textContent = hours;
            
            basePrice = 50;
            totalPrice = basePrice * hours;
            
            billBaseNameText.textContent = selectedPackageName;
            billBaseText.textContent = `$50.00 / hr × ${hours} hrs`;
        } else {
            // Flat packages (basic-consult, analysis-viz, package)
            hourlyScaleGroup.style.display = 'none';
            
            // Read data-price of the active card
            const activeCard = document.querySelector('.service-option-card.active');
            if (activeCard) {
                basePrice = parseFloat(activeCard.getAttribute('data-price')) || 200;
            }
            totalPrice = basePrice;
            
            billBaseNameText.textContent = selectedPackageName;
            billBaseText.textContent = `$${basePrice.toFixed(2)}`;
        }
        
        // Total Estimated price
        billTotalText.textContent = `$${totalPrice.toFixed(2)}`;
        if (btnPriceDisplay) {
            btnPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
        }
    };
    
    // Listeners for Calculator option cards
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            optionCards.forEach(c => {
                c.classList.remove('active');
                c.querySelector('.select-option-btn').textContent = "Select";
            });
            card.classList.add('active');
            card.querySelector('.select-option-btn').textContent = "Selected";
            
            selectedPackage = card.getAttribute('data-package');
            selectedPackageName = card.querySelector('.option-title').textContent;
            
            updatePrices();
        });
    });
    
    if (hourCountInput) {
        hourCountInput.addEventListener('input', updatePrices);
    }
    
    // Initial run to bind prices
    updatePrices();
    
    // Helper function to build invoice table details
    const buildInvoiceTable = () => {
        let invoiceItemsHtml = '';
        
        // 1. Service row
        if (selectedPackage === 'consulting') {
            const hours = parseInt(hourCountInput.value, 10);
            invoiceItemsHtml += `
                <tr>
                    <td>
                        <strong style="color: #0f172a;">${selectedPackageName} (${hours} Hours)</strong>
                        <p style="margin: 3px 0 0 0; font-size: 0.8rem; color: #64748b;">Scientific Consulting Services ($50.00 / hour rate)</p>
                    </td>
                    <td style="text-align: right; font-weight: 500;">$${totalPrice.toFixed(2)}</td>
                </tr>
            `;
        } else {
            let packageDesc = "Full Advanced Manuscript Editing, Drafting, and Publication Support Package";
            if (selectedPackage === 'basic-consult') {
                packageDesc = "Study Design, Sample Size Calculation, and Protocol Review";
            } else if (selectedPackage === 'analysis-viz') {
                packageDesc = "Standard Statistical Analysis and Publication-Ready Visualizations Package";
            }
            
            invoiceItemsHtml += `
                <tr>
                    <td>
                        <strong style="color: #0f172a;">${selectedPackageName}</strong>
                        <p style="margin: 3px 0 0 0; font-size: 0.8rem; color: #64748b;">${packageDesc}</p>
                    </td>
                    <td style="text-align: right; font-weight: 500;">$${totalPrice.toFixed(2)}</td>
                </tr>
            `;
        }
        
        // 2. Totals row
        invoiceItemsHtml += `
            <tr class="total-row">
                <td style="text-align: right; padding-right: 20px; color: #475569;">Total Paid Amount:</td>
                <td style="text-align: right; color: #0b0f19;">$${totalPrice.toFixed(2)}</td>
            </tr>
        `;
        
        invoiceItems.innerHTML = invoiceItemsHtml;
    };
    
    // ==========================================
    // 2. STRIPE CHECKOUT REDIRECTION LOGIC
    // ==========================================
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            if (!e.target.checkValidity()) {
                return;
            }
            e.preventDefault();
            
            const clientNameVal = clientNameInput ? clientNameInput.value : '';
            const clientEmailVal = clientEmailInput ? clientEmailInput.value : '';
            
            // If live Stripe Payment Link is provided, redirect immediately
            if (STRIPE_PAYMENT_LINK && STRIPE_PAYMENT_LINK.trim() !== "") {
                let targetUrl = STRIPE_PAYMENT_LINK.trim();
                if (clientEmailVal) {
                    const separator = targetUrl.includes('?') ? '&' : '?';
                    targetUrl += `${separator}prefilled_email=${encodeURIComponent(clientEmailVal)}`;
                }
                window.location.href = targetUrl;
                return;
            }
            
            // Otherwise, run seamless Stripe redirect simulation
            step1.className = 'status-step active';
            step2.className = 'status-step';
            step3.className = 'status-step';
            step4.className = 'status-step';
            spinnerContainer.className = 'spinner-container';
            
            modalHeading.textContent = 'Connecting to Stripe';
            modalSubtext.textContent = 'Preparing secure payment gateway session...';
            
            step1.querySelector('span').textContent = 'Authenticating client details...';
            step2.querySelector('span').textContent = 'Opening SSL tunnel to stripe.com...';
            step3.querySelector('span').textContent = 'Syncing selected service package line items...';
            step4.querySelector('span').textContent = 'Redirecting to Stripe payment page...';
            
            // Show transaction status modal overlay
            processingModal.classList.add('active');
            
            setTimeout(() => {
                step1.classList.add('complete');
                step2.classList.add('active');
                modalSubtext.textContent = 'Establishing SSL handshake with Stripe...';
            }, 1000);
            
            setTimeout(() => {
                step2.classList.add('complete');
                step3.classList.add('active');
                modalSubtext.textContent = 'Registering checkout price metadata...';
            }, 2000);
            
            setTimeout(() => {
                step3.classList.add('complete');
                step4.classList.add('active');
                modalSubtext.textContent = 'Launching Stripe secure checkout window...';
            }, 3000);
            
            setTimeout(() => {
                step4.classList.add('complete');
                spinnerContainer.classList.add('success');
                modalHeading.textContent = 'Stripe Redirect Completed!';
                modalSubtext.textContent = 'Transaction registered. Generating client record...';
            }, 4000);
            
            setTimeout(() => {
                // Close modal overlay
                processingModal.classList.remove('active');
                
                // Hide Checkout visual and display invoice receipt section
                checkoutMain.style.display = 'none';
                successSection.style.display = 'block';
                
                // Populate invoice details
                invClientName.textContent = clientNameVal || 'Stripe Account Holder';
                invClientEmail.textContent = clientEmailVal;
                
                // Generate Invoice details table rows
                buildInvoiceTable();
                
                // Random Transaction invoice identifier numbers
                const randomId = Math.floor(1000 + Math.random() * 9000);
                invNumberText.textContent = `AV-2026-${randomId}`;
                
                // Format current date
                const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
                invDateText.textContent = new Date().toLocaleDateString('en-US', dateOptions);
                
                // Scroll to top
                window.scrollTo(0, 0);
                
            }, 4900);
        });
    }
    
    // ==========================================
    // 3. PRINT INVOICE BUTTON
    // ==========================================
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
});
