document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const operatorItems = document.querySelectorAll('.operator-item');
    const prefixSelect = document.getElementById('prefix');
    const phoneInput = document.getElementById('phone-number');
    const fullNameInput = document.getElementById('full-name');
    const passportInput = document.getElementById('passport');
    const submitBtn = document.getElementById('submit-btn');
    const formSection = document.getElementById('form-section');
    const successSection = document.getElementById('success-section');
    const backBtn = document.getElementById('back-btn');
    const qrcodeContainer = document.getElementById('qrcode');
    const summaryOperator = document.getElementById('summary-operator');
    const summaryPhone = document.getElementById('summary-phone');

    let selectedOperator = 'Beeline';

    const operatorPrefixes = {
        'Beeline': ['90', '91'],
        'Ucell': ['93', '94', '50'],
        'Mobiuz': ['97', '88'],
        'Uztelecom': ['99', '95', '77']
    };

    function updatePrefixes(operator) {
        prefixSelect.innerHTML = '';
        const prefixes = operatorPrefixes[operator] || [];
        prefixes.forEach(prefix => {
            const option = document.createElement('option');
            option.value = prefix;
            option.textContent = prefix;
            prefixSelect.appendChild(option);
        });
    }

    // Initialize with default
    updatePrefixes(selectedOperator);

    // Operator selection
    operatorItems.forEach(item => {
        item.addEventListener('click', () => {
            operatorItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            selectedOperator = item.getAttribute('data-operator');
            updatePrefixes(selectedOperator);
        });
    });

    // Phone input formatter
    phoneInput.addEventListener('input', function (e) {
        let val = this.value.replace(/\D/g, '');
        if (val.length > 7) {
            val = val.substring(0, 7);
        }
        
        let formatted = '';
        if (val.length > 0) {
            formatted = val.substring(0, 3);
        }
        if (val.length > 3) {
            formatted += ' ' + val.substring(3, 5);
        }
        if (val.length > 5) {
            formatted += ' ' + val.substring(5, 7);
        }
        
        this.value = formatted;
    });

    // Generate QR Code and show success
    submitBtn.addEventListener('click', () => {
        
        const fullName = fullNameInput.value.trim();
        const passport = passportInput.value.trim();
        const prefix = prefixSelect.value;
        const phone = phoneInput.value.trim().replace(/\s/g, '');

        if (!fullName || !passport || phone.length < 7) {
            alert("Iltimos, barcha maydonlarni to'ldiring va to'g'ri raqam kiriting.");
            return;
        }

        // Prepare data for QR code
        const qrDataText = `Foydalanuvchi: ${fullName}, Passport: ${passport}, Tanlangan raqam: +998 ${prefix}${phone}, Holati: Faol (Demo)`;

        // Clear previous QR code if any
        qrcodeContainer.innerHTML = '';

        // Generate QR code
        new QRCode(qrcodeContainer, {
            text: qrDataText,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        // Set summary texts
        summaryOperator.textContent = `Operator: ${selectedOperator}`;
        summaryPhone.textContent = `+998 ${prefix} ${phoneInput.value}`;

        // Switch screens with animation
        formSection.classList.add('hidden');
        successSection.classList.remove('hidden');
        
        // Re-trigger slide up for success contents
        Array.from(successSection.children).forEach((child, index) => {
            child.classList.remove('slide-up');
            // triggering reflow
            void child.offsetWidth;
            child.classList.add('slide-up');
            child.style.animationDelay = `${index * 0.1}s`;
        });
    });

    // Back button
    backBtn.addEventListener('click', () => {
        successSection.classList.add('hidden');
        formSection.classList.remove('hidden');
    });

});
