// ============================================================
// FORM MULTI-STEP, VALIDATION & SUBMISSION
// ============================================================

// TODO: Replace with actual keys before deployment
// EmailJS Initialization — emailjs.init("YOUR_PUBLIC_KEY");
// Form submissions route to:
//   In-Class -> info@belldriver.ca
//   Online   -> joe.belldriveredu@gmail.com
// The recipient_email field in formData is set automatically based on program_type.
// Use {{recipient_email}} as the "To" address in your EmailJS template.

// Firebase Initialization
const firebaseConfig = {
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  // projectId: "YOUR_PROJECT_ID",
  // storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "SENDER_ID",
//   appId: "APP_ID"
};
// firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('registration-form')) return;

  const form = document.getElementById('registration-form');
  let currentStep = 1;
  let fileToUpload = null;

  // State Management
  const showStep = (step) => {
    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.step-item').forEach(el => {
      const stepNum = parseInt(el.id.split('-')[1]);
      el.classList.remove('active', 'completed');
      if (stepNum < step) el.classList.add('completed');
      if (stepNum === step) el.classList.add('active');
    });
    document.getElementById(`step-${step}`).classList.add('active');
    currentStep = step;
    window.scrollTo({ top: document.querySelector('.register-card').offsetTop - 100, behavior: 'smooth' });
  };

  // Step 1 Validation
  const validateStep1 = () => {
    let isValid = true;
    const requiredInputIds = ['program_type', 'student_name', 'email', 'license_number', 'phone', 'address', 'city', 'postal_code'];
    
    // Check texts
    requiredInputIds.forEach(id => {
      const el = document.getElementById(id);
      const errorDiv = el.nextElementSibling;
      if (!el.value.trim()) {
        el.classList.add('error');
        if(errorDiv && errorDiv.classList.contains('form-error')) errorDiv.classList.add('visible');
        isValid = false;
      } else {
        el.classList.remove('error');
        if(errorDiv && errorDiv.classList.contains('form-error')) errorDiv.classList.remove('visible');
        
        // Basic email check
        if (id === 'email' && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(el.value)) {
            el.classList.add('error');
            errorDiv.textContent = 'Please enter a valid email address.';
            errorDiv.classList.add('visible');
            isValid = false;
        }
      }
    });

    // Check licence length roughly
    const lic = document.getElementById('license_number');
    if (lic.value.trim() && lic.value.trim().length < 5) {
        lic.classList.add('error');
        lic.nextElementSibling.classList.add('visible');
        isValid = false;
    }

    // Check consent
    const consent = document.getElementById('consent');
    if (!consent.checked) {
      document.getElementById('consent-error').classList.add('visible');
      isValid = false;
    } else {
      document.getElementById('consent-error').classList.remove('visible');
    }

    return isValid;
  };

  // Step 2 Validation (File)
  const validateStep2 = () => {
    if (!fileToUpload) {
      document.getElementById('file-error').classList.add('visible');
      return false;
    }
    document.getElementById('file-error').classList.remove('visible');
    return true;
  };

  // Navigation Logic
  document.getElementById('btn-next-1').addEventListener('click', () => { if (validateStep1()) showStep(2); });
  document.getElementById('btn-prev-2').addEventListener('click', () => showStep(1));
  document.getElementById('btn-next-2').addEventListener('click', () => { if (validateStep2()) showStep(3); });
  document.getElementById('btn-prev-3').addEventListener('click', () => showStep(2));
  document.getElementById('btn-next-3').addEventListener('click', () => showStep(4));
  document.getElementById('btn-prev-4').addEventListener('click', () => showStep(3));

  // Course Date Modal
  let selectedCourse = '';
  const modalOverlay = document.getElementById('date-modal-overlay');
  const modalConfirmBtn = document.getElementById('date-modal-confirm');
  const courseDisplay = document.getElementById('selected-course-display');

  const openModal = () => {
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.getElementById('btn-select-date').addEventListener('click', openModal);
  document.getElementById('date-modal-close').addEventListener('click', closeModal);
  document.getElementById('date-modal-cancel').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

  // Enable confirm when a radio is selected
  document.querySelectorAll('input[name="selected_course"]').forEach(radio => {
    radio.addEventListener('change', () => {
      modalConfirmBtn.disabled = false;
    });
  });

  // Confirm selection
  modalConfirmBtn.addEventListener('click', () => {
    const checked = document.querySelector('input[name="selected_course"]:checked');
    if (!checked) return;
    selectedCourse = checked.value;
    // Build display text from the option content
    const option = checked.closest('.course-option');
    const code = option.querySelector('.course-code').textContent;
    const type = option.querySelector('.course-type').textContent;
    courseDisplay.textContent = `✓ Selected: ${code} — ${type}`;
    courseDisplay.style.display = 'block';
    closeModal();
  });

  // Remove visible error when typing
  document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const err = input.nextElementSibling;
      if (err && err.classList.contains('form-error')) err.classList.remove('visible');
    });
  });
  document.getElementById('consent').addEventListener('change', () => {
    document.getElementById('consent-error').classList.remove('visible');
  });

  // Dropzone / File logic
  const fileInput = document.getElementById('g1_scan');
  const dropZone = document.getElementById('drop-zone');
  const filePreview = document.getElementById('file-preview');
  const previewImg = document.getElementById('preview-img');
  const previewName = document.getElementById('preview-name');
  
  const handleFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const errorEl = document.getElementById('file-error');

    if (!validTypes.includes(file.type)) {
      errorEl.textContent = "Invalid file type. Please upload a JPG, PNG, or PDF.";
      errorEl.classList.add('visible');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
      errorEl.textContent = "File is too large. Maximum size is 5MB.";
      errorEl.classList.add('visible');
      return;
    }

    errorEl.classList.remove('visible');
    fileToUpload = file;
    dropZone.style.display = 'none';
    filePreview.classList.add('visible');
    previewName.textContent = file.name;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => { previewImg.src = e.target.result; previewImg.style.display = 'block'; };
      reader.readAsDataURL(file);
    } else {
      previewImg.style.display = 'none'; // hide img for pdf
    }
  };

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleFile(e.target.files[0]);
  });

  ['dragover', 'dragleave', 'drop'].forEach(evt => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (evt === 'dragover') dropZone.classList.add('drag-over');
      if (evt === 'dragleave' || evt === 'drop') dropZone.classList.remove('drag-over');
      if (evt === 'drop' && e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
  });

  document.getElementById('btn-remove-file').addEventListener('click', () => {
    fileToUpload = null;
    fileInput.value = '';
    filePreview.classList.remove('visible');
    dropZone.style.display = 'block';
  });

  // Submission
  const submitBtn = document.getElementById('btn-submit');
  const submitText = document.getElementById('submit-text');
  const submitSpinner = document.getElementById('submit-spinner');

  const showToast = (msg, isError = false) => {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast show ${isError ? 'error' : 'success'}`;
    setTimeout(() => { toast.classList.remove('show'); }, 5000);
  };

  document.getElementById('btn-submit').addEventListener('click', async () => {
    // Collect data
    const programType = document.getElementById('program_type').value;
    const formData = {
      program_type: programType,
      student_name: document.getElementById('student_name').value,
      high_school: document.getElementById('high_school').value,
      email: document.getElementById('email').value,
      license_number: document.getElementById('license_number').value,
      phone: document.getElementById('phone').value,
      cell: document.getElementById('cell').value,
      address: document.getElementById('address').value,
      apt: document.getElementById('apt').value,
      city: document.getElementById('city').value,
      postal_code: document.getElementById('postal_code').value,
      intersection: document.getElementById('intersection').value,
      how_heard: document.getElementById('how_heard').value,
      selected_course: selectedCourse,
      recipient_email: programType === 'Online' ? 'joe.belldriveredu@gmail.com' : 'info@belldriver.ca'
    };

    submitBtn.disabled = true;
    submitText.textContent = 'Uploading & Sending...';
    submitSpinner.style.display = 'inline-block';

    try {
        /* TODO Uncomment when Firebase/EmailJS configured 
        
        // 1. Upload to Firebase Storage
        const storageRef = firebase.storage().ref();
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}_${fileToUpload.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const licenseRef = storageRef.child(`g1-licenses/${fileName}`);
        
        const snapshot = await licenseRef.put(fileToUpload);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        // Add URL to data
        formData.g1_license_url = downloadURL;

        // 2. Send Email via EmailJS
        // Replace SERVICE_ID and TEMPLATE_ID
        await emailjs.send("SERVICE_ID_HERE", "TEMPLATE_ID_HERE", formData);
        
        */
        
        // Simulate network for local test
        await new Promise(r => setTimeout(r, 2000));
        
        showToast("Application submitted successfully! We will contact you shortly.");
        
        // Reset
        form.reset();
        fileToUpload = null;
        filePreview.classList.remove('visible');
        dropZone.style.display = 'block';
        showStep(1);

    } catch (err) {
        console.error("Submission error:", err);
        showToast("An error occurred. Please try again or contact us by phone.", true);
    } finally {
        submitBtn.disabled = false;
        submitText.textContent = 'Submit Application';
        submitSpinner.style.display = 'none';
    }
  });

});
