export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveType {
    id: number;
    name: string;
    isPaid: boolean;
    defaultAnnualQuota: number;
    applicableRoles: string[];
    requiresDocumentUpload: boolean;
}

export interface LeaveBalance {
    id: number;
    leaveType: LeaveType;
    academicYear: string;
    totalGranted: number;
    totalUsed: number;
    balance: number;
}

export interface LeaveRequest {
    id: number;
    requesterId: number;
    requesterName?: string;
    leaveType: Partial<LeaveType>;
    startDate: string;
    endDate: string;
    isHalfDay: boolean;
    reason: string;
    attachmentUrl?: string;
    status: LeaveStatus;
    approverId?: number;
    approverComments?: string;
    actionedAt?: string;
    createdAt: string;
}
