import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { UserService } from '@/core/service/user.service';
import { ToastModule } from 'primeng/toast';
import { InvestorService } from '@/core/service/investor.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    ButtonModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    ReactiveFormsModule,
    DatePickerModule,
    CommonModule,
    ToastModule,
  ],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  editable: boolean = false;
  userEmail!: string;
  

  maritalStatuses = [
    { label: 'Célibataire', value: 'single' },
    { label: 'Marié', value: 'married' },
    { label: 'Pacsé', value: 'pacsed' },
    { label: 'Divorcé', value: 'divorced' },
    { label: 'Veuf', value: 'widowed' },
  ];

  constructor(
    private fb: FormBuilder,
    private investorService: InvestorService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.userEmail = user.email;
        this.initForm(user);
      }
    });
    this.loadUserProfile();
  }

  initForm(user?: any): void {
    this.profileForm = this.fb.group({
      lastName: [
        { value: user?.lastName || '', disabled: true },
        Validators.required,
      ],
      firstName: [
        { value: user?.firstName || '', disabled: true },
        Validators.required,
      ],
      email: [{ value: user?.email || '', disabled: true }],
      phoneNumber: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern('^\\d{10}$')],
      ],
      dateOfBirth: [{ value: '', disabled: true }, [Validators.required]],
      maritalStatus: [{ value: '', disabled: true }, Validators.required],
      numberOfChildren: [
        { value: 0, disabled: true },
        [Validators.required, Validators.min(0)],
      ],
      annualIncome: [
        { value: 0, disabled: true },
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  loadUserProfile(): void {
    this.investorService
      .getInvestorByEmail(this.userEmail)
      .subscribe((userData: any) => {
        const dateOfBirth = userData.dateOfBirth
          ? new Date(userData.dateOfBirth)
          : null;
        this.profileForm.reset({
          lastName: userData.lastName,
          firstName: userData.firstName,
          email: userData.email,
          phoneNumber: userData.phoneNumber || '',
          dateOfBirth: dateOfBirth,
          maritalStatus: userData.maritalStatus || '',
          numberOfChildren: userData.numberOfChildren || 0,
          annualIncome: userData.annualIncome || 0,
        });
      });
  }

  toggleEdit(): void {
    this.editable = !this.editable;
    if (this.editable) {
      Object.keys(this.profileForm.controls).forEach((field) => {
        if (field !== 'email') this.profileForm.controls[field].enable();
      });
    } else {
      this.disableFormControls();
    }
  }

  submitForm(): void {
    if (this.profileForm.valid) {
      this.editable = false;
      this.disableFormControls();

      const formData = this.profileForm.value;
      formData.dateOfBirth =
        formData.dateOfBirth instanceof Date
          ? formData.dateOfBirth.toISOString().split('T')[0]
          : formData.dateOfBirth;

      this.investorService
        .createOrUpdateInvestor(this.userEmail, formData)
        .subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: 'Le profil a été mis à jour avec succès.',
            });
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: 'Erreur lors de la mise à jour du profil.',
            });
          }
        );
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez compléter tous les champs obligatoires.',
      });
    }
  }

  disableFormControls(): void {
    Object.keys(this.profileForm.controls).forEach((field) => {
      this.profileForm.controls[field].disable();
    });
  }
}
