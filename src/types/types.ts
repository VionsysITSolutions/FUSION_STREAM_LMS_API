export type IHttpResponse = {
    success: boolean;
    statusCode: number;
    request: {
        method: string;
        url: string;
    };
    message: string;
    data: unknown;
};

export type IHttpError = {
    success: boolean;
    statusCode: number;
    request: {
        method: string;
        url: string;
    };
    message: string;
    data: unknown;
    trace?: object | null;
};

export type JwtPayload = {
    userId: number;
    role: string;
    iat: number;
    exp: number;
};
export type EnrollStudentBody = {
    batchId: string;
    studentId: string;
};

export type updateBatchBody = {
    name: string;
    description: string;
    startDate: Date | string;
    duration: number;
    batchTimeSlot: 'morning' | 'afternoon' | 'evening';
    courseId: string;
};

export type UpdateBatchModuleBody = {
    title: string;
    description: string;
    instructorId: number;
    batchId: string;
};

export type UpdateBatchSessionBody = {
    topicName: string;
    summary: string;
    sessionDate: Date | string;
    meetLink: string;
    recordingURL?: string;
    batchModuleId: string;
};

export type UpdateCourseBody = {
    name: string;
    description: string;
    category: string;
    isApproved?: boolean;
    approvedById?: number;
    isDeleted?: boolean;
    thumbnailUrl?: string;
    price?: number;
};

export type UpdateCourseModuleBody = {
    title: string;
    summary: string;
    courseId: string;
};

export type UpdateModuleContentBody = {
    name: string;
    description: string;
    mediaUrl: string;
    moduleId: string;
};
// Add these types to your existing types.ts file

// Assessment Types
export interface CreateAssessmentBody {
    title: string;
    totalMarks: number;
    batchModuleId?: string;
    batchId?: string;
    assessmentType: 'module' | 'final';
}

export interface QuestionBody {
    questionText: string;
    marks: number;
    assessmentType: 'module' | 'final';
    moduleAssessmentId?: string;
    finalAssessmentId?: string;
    options: {
        optionText: string;
        isCorrect: boolean;
    }[];
}

// Submission Types
export interface CreateSubmissionBody {
    studentId: number;
    assessmentType: 'module' | 'final';
    moduleAssessmentId?: string;
    finalAssessmentId?: string;
    answers: {
        questionId: string;
        selectedOptionId: string;
    }[];
}

// Progress Tracking Types
export interface ModuleProgressBody {
    studentId: number;
    moduleId: string;
    isCompleted: boolean;
    completedAt?: Date;
}

export interface SessionAttendanceBody {
    studentId: number;
    sessionId: string;
    attendanceType: 'live' | 'recorded';
    isAttended: boolean;
    attendedAt?: Date;
}

export interface CourseProgressBody {
    batchId: string;
    studentId: number;
    progrssPercent: number;
    isCompleted: boolean;
}

export interface VideoProgressBody {
    userId: number;
    sessionId: string;
    time: number;
    batchId: string;
}

export interface studnetAbsenseSMSPaylaod {
    parentsNumber: string;
    firstName: string;
    batchName: string;
    sessionName: string;
    sessionTime: Date;
}
