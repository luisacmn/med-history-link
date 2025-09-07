# Digital Health Records Micro-SaaS (MVP)

![Status](https://img.shields.io/badge/status-MVP-yellow)

![Landing Page](./src/assets/digital%20medical%20records.png)

This project is a Minimum Viable Product (MVP) for a micro-SaaS platform designed for healthcare professionals (doctors, nutritionists, physiotherapists, etc.) to provide their patients with an organized and practical way to manage medical records, including exams, medications, history, and vaccinations. The main goal is to make consultations more efficient and increase patient retention.

## Database
The application uses **Supabase** as the database backend.

## How It Works
- **Professional registration:** Healthcare professionals register patients at the time of appointment scheduling by sending a link or QR code for the patient to sign up.  
- **Patient dashboard:** Patients can access all their information through an organized dashboard with tabs for exams, medications, vaccinations, and medical history. They can view their records and upload new documents (PDF/PNG) via a modal form.  
- **Professional dashboard:** Professionals can view the full list of patients, including the date of the last consultation and complete medical history.

## Monetization
- The **Basic Plan** allows registering up to 5 patients.  
- For additional patients, the **Pro Plan** can be purchased.

## Features to Implement
- **Authentication:** User login and registration for professionals, patients, and admin accounts.  
- **Stripe API payments:** Upgrade plans and handle subscriptions securely.  
- **Database updates for patient history:** Create, edit, delete items (medications, exams, vaccinations, history) and display them in the patient dashboard.  
- **Admin accounts for healthcare professionals:** Professionals can create admin/secretary accounts to register new patients, enabling team collaboration.

## Scalability
The MVP can be scaled for clinics and hospitals, allowing registration of multiple professionals and patients. The platform aims to provide a service that increases patient loyalty and streamlines consultation workflows.

## Demo
You can check out the live demo of the application here: [Digital Health Records MVP](https://med-history-link.lovable.app/)



