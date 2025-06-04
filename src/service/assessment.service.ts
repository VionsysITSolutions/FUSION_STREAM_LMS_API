import prisma from '../lib/db';
import redis from '../lib/redis';
import { CreateAssessmentBody, QuestionBody } from '../types/types';

export default {
    // Module Assessment Methods
    createModuleAssessment: async (assessmentData: CreateAssessmentBody) => {
        return prisma.module_assessment.create({
            data: {
                title: assessmentData.title,
                totalMarks: assessmentData.totalMarks,
                batchModuleId: assessmentData.batchModuleId!
            },
            include: {
                batchModule: true,
                questions: {
                    include: {
                        questionOptions: true
                    }
                }
            }
        });
    },
    updateModuleAssessment: async (id: string, assessmentData: Partial<CreateAssessmentBody>) => {
        return prisma.module_assessment.update({
            where: {
                id
            },
            data: {
                title: assessmentData.title,
                totalMarks: assessmentData.totalMarks,
                batchModuleId: assessmentData.batchModuleId
            },
            include: {
                batchModule: true,
                questions: {
                    include: {
                        questionOptions: true
                    }
                }
            }
        });
    },

    // Final Assessment Methods
    createFinalAssessment: async (assessmentData: CreateAssessmentBody) => {
        const existingAssessment = await prisma.final_assessment.findFirst({
            where: { batchId: assessmentData.batchId! }
        });
        if (existingAssessment) {
            throw new Error('Final assessment for this batch already exists');
        }
        return prisma.final_assessment.create({
            data: {
                title: assessmentData.title,
                totalMarks: assessmentData.totalMarks,
                batchId: assessmentData.batchId!
            },
            include: {
                batch: true,

                questions: {
                    include: {
                        questionOptions: true
                    }
                }
            }
        });
    },
    updateFinalAssessment: async (assessmentId: string, assessmentData: CreateAssessmentBody) => {
        const existingAssessment = await prisma.final_assessment.findUnique({
            where: { id: assessmentId }
        });

        if (!existingAssessment) {
            throw new Error('Final assessment not found');
        }

        // Optional: Enforce uniqueness check if needed during update
        // But typically uniqueness is enforced during creation, not update

        return prisma.final_assessment.update({
            where: { id: assessmentId },
            data: {
                title: assessmentData.title,
                totalMarks: assessmentData.totalMarks,
                batchId: assessmentData.batchId!
            },
            include: {
                batch: true,
                questions: {
                    include: {
                        questionOptions: true
                    }
                }
            }
        });
    },

    getModuleAssessmentById: async (id: string) => {
        return prisma.module_assessment.findMany({
            where: { batchModuleId: id },
            include: {
                batchModule: true,
                questions: {
                    include: {
                        questionOptions: true
                    }
                },
                submissions: {
                    include: {
                        student: true,
                        answers: {
                            include: {
                                question: true,
                                selectedOption: true
                            }
                        }
                    }
                }
            }
        });
    },

    getFinalAssessmentById: async (id: string) => {
        return prisma.final_assessment.findFirst({
            where: { batchId: id },
            include: {
                batch: true,

                questions: {
                    include: {
                        questionOptions: true
                    }
                },
                submissions: {
                    include: {
                        student: true,
                        answers: {
                            include: {
                                question: true,
                                selectedOption: true
                            }
                        }
                    }
                }
            }
        });
    },

    // Question Methods
    createQuestion: async (questionData: QuestionBody) => {
        const { options, ...questionFields } = questionData;

        return prisma.questions.create({
            data: {
                ...questionFields,
                questionOptions: {
                    create: options
                }
            },
            include: {
                questionOptions: true,
                moduleAssessment: true,
                finalAssessment: true
            }
        });
    },

    getQuestionById: async (id: string) => {
        return prisma.questions.findUnique({
            where: { id },
            include: {
                questionOptions: true,
                moduleAssessment: true,
                finalAssessment: true
            }
        });
    },

    updateQuestion: async (id: string, data: Partial<QuestionBody>) => {
        const { options, ...questionFields } = data;

        // Update question
        await prisma.questions.update({
            where: { id },
            data: questionFields
        });

        // If options are provided, update them
        if (options) {
            // Delete existing options
            await prisma.options.deleteMany({
                where: { questionId: id }
            });

            // Create new options
            await prisma.options.createMany({
                data: options.map((opt) => ({
                    ...opt,
                    questionId: id
                }))
            });
        }

        return prisma.questions.findUnique({
            where: { id },
            include: {
                questionOptions: true
            }
        });
    },

    deleteQuestion: async (id: string) => {
        const existingQuestion = await prisma.questions.findFirst({
            where: { id }
        });

        if (!existingQuestion) {
            throw new Error('Question not found');
        }

        return prisma.questions.delete({
            where: { id }
        });
    },

    getQuestionsByAssessment: async (assessmentId: string, assessmentType: 'module' | 'final') => {
        return prisma.questions.findMany({
            where: assessmentType === 'module' ? { moduleAssessmentId: assessmentId } : { finalAssessmentId: assessmentId },
            include: {
                questionOptions: true
            }
        });
    },

    saveAssessmentStatusToRedis: async (assessmentId: string, userId: number, answers: Record<string, string>, currentIndex: number) => {
        const key = `quiz_${userId}_${assessmentId}`;
        const data = { answers, currentIndex };
        await redis.set(key, JSON.stringify(data), 'EX', 60 * 60 * 24);
        return data;
    },
    getAssessmentStatusFromRedis: async (
        assessmentId: string,
        userId: number
    ): Promise<{ answers: Record<string, string>; currentIndex: number } | null> => {
        const key = `quiz_${userId}_${assessmentId}`;
        const status = await redis.get(key);
        return status ? (JSON.parse(status) as { answers: Record<string, string>; currentIndex: number }) : null;
    }
};
