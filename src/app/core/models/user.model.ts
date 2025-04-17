// models/user.model.ts
export interface User {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
    jobRole?: string;
    companyName?: string;
    // Additional fields can be added as needed
  }
  
  export interface PurchaseRecord {
    _id: string;
    courseId: string;
    userId: string;
    purchaseDate: Date;
    selectedDate: Date;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    paymentMethod?: string;
    transactionId?: string;
    amount: number;
  }
  
  export interface CompanyPurchase {
    id: string;
    courseId: string;
    companyName: string;
    rfc: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    quantity: number;
    selectedDate: Date;
    status: 'pending' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';
    additionalInfo?: string;
  }