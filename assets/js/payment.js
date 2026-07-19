/* ==========================================================================
   AVAN STAT - Payment Portal Interactive Logic
   ========================================================================== */

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
    
    // Elements - Credit Card Inputs
    const cardElement = document.getElementById('credit-card');
    const cardNumInput = document.getElementById('card-num-input');
    const cardHolderInput = document.getElementById('client-name');
    const cardExpiryInput = document.getElementById('card-expiry-input');
    const cardCvvInput = document.getElementById('card-cvv-input');
    
    // Elements - Credit Card Display
    const cardNumDisplay = document.getElementById('card-num-display');
    const cardHolderDisplay = document.getElementById('card-holder-display');
    const cardExpiryDisplay = document.getElementById('card-expiry-display');
    const cardCvvDisplay = document.getElementById('card-cvv-display');
    const cardBrandLogo = document.getElementById('card-brand-logo');
    
    // Elements - Stripe Experience Toggle
    const methodEmbeddedBtn = document.getElementById('method-embedded-btn');
    const methodHostedBtn = document.getElementById('method-hosted-btn');
    const radioEmbedded = document.getElementById('radio-embedded');
    const radioHosted = document.getElementById('radio-hosted');
    const cardPreviewContainer = document.getElementById('credit-card-preview-container');
    const embeddedCcFields = document.getElementById('embedded-cc-fields');
    const hostedCheckoutInfo = document.getElementById('hosted-checkout-info');
    const btnSubmitText = document.getElementById('btn-submit-text');
    
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
        btnPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
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
    
    hourCountInput.addEventListener('input', updatePrices);
    
    // Initial run to bind prices
    updatePrices();
    
    // ==========================================
    // 2. CREDIT CARD DISPLAY INTERACTIVITY
    // ==========================================
    
    // Formatting Credit Card Number with spaces (1111 2222 3333 4444)
    cardNumInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // strip non-digits
        
        // Format with space grouping
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        e.target.value = formattedValue;
        
        // Render onto front-card face
        if (formattedValue.length > 0) {
            cardNumDisplay.textContent = formattedValue;
        } else {
            cardNumDisplay.textContent = '•••• •••• •••• ••••';
        }
        
        // Dynamic Card Network Detection
        if (value.startsWith('4')) {
            cardBrandLogo.innerHTML = `<svg viewBox="0 0 100 32" style="height: 24px; fill: white;"><path d="M12.4 2.1l-6 19.3h-4.3l-3.3-13.8c-.2-.7-.4-.9-1-1.3-.9-.6-2.5-.9-3.8-1.2L0 4.6h8.2c1 .0 1.8.6 2 1.5l1.9 9.8 4.2-11.2c.2-.5.8-.8 1.4-.8h6.7c.3.0.6.2.7.5l-6.8 17h-4.3l-1.5-9.3zM40.3 2.1H44l-3.3 19.3h-3.6l3.2-19.3zm-6-2.1h-4l-8.6 13c-.3.4-.5.8-.8 1.2h-.1L21.3 0H17.7l-3.8 21.4h4.1l1.5-8.2c.2-1.3.8-2.6 1.3-3.8L28.1 21.4h4.2l8-21.4zM53 2.1c-.2-.7-.9-1.2-2.1-1.2H46l-.5 3h4.6c.5 0 .8.1 1 .3.2.2.3.5.2.8l-.8 4.2c-.4 2.2 1.3 4.1 3.5 4.1 2.2 0 4-1.8 4.4-4.1l1.1-6.1c-.1-1.2-.8-1-1.9-1z"/></svg>`;
        } else if (value.startsWith('5')) {
            cardBrandLogo.innerHTML = `<svg viewBox="0 0 50 32" style="height: 28px;"><circle cx="16" cy="16" r="16" fill="#EB001B" opacity="0.85"/><circle cx="34" cy="16" r="16" fill="#F79E1B" opacity="0.85"/><path d="M25 5.5a10.5 10.5 0 0 1 0 21 10.5 10.5 0 0 1 0-21z" fill="#FF5F00"/></svg>`;
        } else if (value.startsWith('3')) {
            cardBrandLogo.textContent = 'AMEX';
        } else {
            cardBrandLogo.textContent = 'CARD';
        }
    });
    
    // Formatting Card Holder Name
    cardHolderInput.addEventListener('input', (e) => {
        let value = e.target.value.toUpperCase();
        if (value.length > 0) {
            cardHolderDisplay.textContent = value;
        } else {
            cardHolderDisplay.textContent = 'CARDHOLDER NAME';
        }
    });
    
    // Formatting Expiry date as MM/YY
    cardExpiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // strip non-digits
        
        let formattedValue = '';
        if (value.length > 0) {
            formattedValue = value.substring(0, 2);
            if (value.length > 2) {
                formattedValue += '/' + value.substring(2, 4);
            }
        }
        
        e.target.value = formattedValue;
        
        if (formattedValue.length > 0) {
            cardExpiryDisplay.textContent = formattedValue;
        } else {
            cardExpiryDisplay.textContent = 'MM/YY';
        }
    });
    
    // Formatting CVV code and flip triggers
    cardCvvInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // strip non-digits
        e.target.value = value;
        
        if (value.length > 0) {
            cardCvvDisplay.textContent = value;
        } else {
            cardCvvDisplay.textContent = '***';
        }
    });
    
    // Flip Card on Focus / Blur of CVV field
    cardCvvInput.addEventListener('focus', () => {
        cardElement.classList.add('flipped');
    });
    
    cardCvvInput.addEventListener('blur', () => {
        cardElement.classList.remove('flipped');
    });
    
    // Double click to flip manually
    cardElement.addEventListener('click', () => {
        cardElement.classList.toggle('flipped');
    });
    
    // ==========================================
    // 3. STRIPE CHECKOUT METHOD TOGGLE LOGIC
    // ==========================================
    const toggleCheckoutMethod = (method) => {
        if (method === 'hosted') {
            methodHostedBtn.classList.add('active');
            methodHostedBtn.style.borderColor = 'var(--accent-primary)';
            methodHostedBtn.style.background = 'rgba(79, 70, 229, 0.04)';
            
            methodEmbeddedBtn.classList.remove('active');
            methodEmbeddedBtn.style.borderColor = 'var(--card-border)';
            methodEmbeddedBtn.style.background = 'transparent';
            
            radioHosted.checked = true;
            
            // Hide card preview and embedded inputs
            cardPreviewContainer.style.display = 'none';
            embeddedCcFields.style.display = 'none';
            
            // Show hosted checkout notice
            hostedCheckoutInfo.style.display = 'block';
            
            // Update button text
            btnSubmitText.textContent = 'Redirect to Stripe Checkout';
            
            // Remove required attribute from card inputs
            cardNumInput.removeAttribute('required');
            cardExpiryInput.removeAttribute('required');
            cardCvvInput.removeAttribute('required');
        } else {
            methodEmbeddedBtn.classList.add('active');
            methodEmbeddedBtn.style.borderColor = 'var(--accent-primary)';
            methodEmbeddedBtn.style.background = 'rgba(79, 70, 229, 0.04)';
            
            methodHostedBtn.classList.remove('active');
            methodHostedBtn.style.borderColor = 'var(--card-border)';
            methodHostedBtn.style.background = 'transparent';
            
            radioEmbedded.checked = true;
            
            // Show card preview and embedded inputs
            cardPreviewContainer.style.display = 'block';
            embeddedCcFields.style.display = 'block';
            
            // Hide hosted checkout notice
            hostedCheckoutInfo.style.display = 'none';
            
            // Update button text
            btnSubmitText.textContent = 'Confirm and Securely Pay';
            
            // Add required attribute to card inputs
            cardNumInput.setAttribute('required', '');
            cardExpiryInput.setAttribute('required', '');
            cardCvvInput.setAttribute('required', '');
        }
    };
    
    if (methodEmbeddedBtn && methodHostedBtn) {
        methodEmbeddedBtn.addEventListener('click', () => toggleCheckoutMethod('embedded'));
        methodHostedBtn.addEventListener('click', () => toggleCheckoutMethod('hosted'));
    }
    
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
            let packageDesc = "Full Advanced Modeling, Manuscript Drafting, and Publication Support Package";
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
    // 4. SECURE TRANSACTION SIMULATION LOOP
    // ==========================================
    paymentForm.addEventListener('submit', (e) => {
        if (!e.target.checkValidity()) {
            return;
        }
        e.preventDefault();
        
        // Determine selected Stripe flow
        const isHostedFlow = radioHosted && radioHosted.checked;
        
        // Reset status step states
        step1.className = 'status-step active';
        step2.className = 'status-step';
        step3.className = 'status-step';
        step4.className = 'status-step';
        spinnerContainer.className = 'spinner-container';
        
        if (isHostedFlow) {
            // Customize steps for Stripe Hosted redirection
            modalHeading.textContent = 'Connecting to Stripe';
            modalSubtext.textContent = 'Initiating secure payment gateway session...';
            
            step1.querySelector('span').textContent = 'Opening SSL tunnel to stripe.com...';
            step2.querySelector('span').textContent = 'Generating unique Stripe Checkout Session token...';
            step3.querySelector('span').textContent = 'Syncing billing line items metadata...';
            step4.querySelector('span').textContent = 'Redirecting to Stripe Hosted Payment Page...';
        } else {
            // Customize steps for Embedded Stripe Elements verification
            modalHeading.textContent = 'Securing Transaction';
            modalSubtext.textContent = 'Processing payment token through Stripe Elements...';
            
            step1.querySelector('span').textContent = 'Tokenizing card details via Stripe.js...';
            step2.querySelector('span').textContent = 'Verifying Stripe security handshake...';
            step3.querySelector('span').textContent = 'Authorizing card payment with Stripe API...';
            step4.querySelector('span').textContent = 'Generating client invoice receipt...';
        }
        
        // Show transaction status modal overlay
        processingModal.classList.add('active');
        
        // Stage Timers simulating Stripe payment steps
        setTimeout(() => {
            step1.classList.add('complete');
            step2.classList.add('active');
            modalSubtext.textContent = isHostedFlow 
                ? 'Authenticating Stripe API handshake...' 
                : 'Encrypting tokenized client details...';
        }, 1200);
        
        setTimeout(() => {
            step2.classList.add('complete');
            step3.classList.add('active');
            modalSubtext.textContent = isHostedFlow 
                ? 'Registering invoice line items...' 
                : 'Contacting issuing card processor bank...';
        }, 2400);
        
        setTimeout(() => {
            step3.classList.add('complete');
            step4.classList.add('active');
            modalSubtext.textContent = isHostedFlow 
                ? 'Launching Stripe secure portal screen...' 
                : 'Finalizing secure transaction ledger...';
        }, 3600);
        
        setTimeout(() => {
            step4.classList.add('complete');
            spinnerContainer.classList.add('success');
            
            if (isHostedFlow) {
                modalHeading.textContent = 'Redirecting to Stripe!';
                modalSubtext.textContent = 'Establishing portal redirect. Thank you...';
            } else {
                modalHeading.textContent = 'Transaction Successful!';
                modalSubtext.textContent = 'Payment Authorized. Securing scientific invoice...';
            }
        }, 4800);
        
        setTimeout(() => {
            // Close modal overlay
            processingModal.classList.remove('active');
            
            // Hide Checkout visual and display acceptance page with printable invoice
            checkoutMain.style.display = 'none';
            successSection.style.display = 'block';
            
            // Build Invoice details dynamically
            const clientNameVal = cardHolderInput.value || 'Stripe Account Holder';
            const clientEmailVal = document.getElementById('client-email').value;
            
            invClientName.textContent = clientNameVal;
            invClientEmail.textContent = clientEmailVal;
            
            // Generate Invoice details table rows
            buildInvoiceTable();
            
            // Random Transaction invoice identifier numbers
            const randomId = Math.floor(1000 + Math.random() * 9000);
            invNumberText.textContent = `AV-2026-${randomId}`;
            
            // Format current date
            const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
            invDateText.textContent = new Date().toLocaleDateString('en-US', dateOptions);
            
            // Scroll to success banner top
            window.scrollTo(0, 0);
            
        }, 5800);
    });
    
    // ==========================================
    // 5. PRINT INVOICE BUTTON
    // ==========================================
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
});
