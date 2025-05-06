import prisma from '../lib/db';
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

    // Final Assessment Methods
    createFinalAssessment: async (assessmentData: CreateAssessmentBody) => {
        return prisma.final_assessment.create({
            data: {
                title: assessmentData.title,
                totalMarks: assessmentData.totalMarks,
                batchId: assessmentData.batchId!,
                courseId: assessmentData.courseId!
            },
            include: {
                batch: true,
                course: true,
                questions: {
                    include: {
                        questionOptions: true
                    }
                }
            }
        });
    },

    getModuleAssessmentById: async (id: string) => {
        return prisma.module_assessment.findUnique({
            where: { id },
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
        return prisma.final_assessment.findUnique({
            where: { id },
            include: {
                batch: true,
                course: true,
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
        // Delete options first due to foreign key constraints
        await prisma.options.deleteMany({
            where: { questionId: id }
        });

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
    }
};
