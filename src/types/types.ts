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
    category?: string;
    isApproved?: boolean;
    approvedById?: number;
    isDeleted?: boolean;
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
