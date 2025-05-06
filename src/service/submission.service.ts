import prisma from '../lib/db';
import { CreateSubmissionBody } from '../types/types';

export default {
    createSubmission: async (submissionData: CreateSubmissionBody) => {
        const { answers, ...submissionFields } = submissionData;

        // Calculate obtained marks
        let obtainedMarks = 0;
        for (const answer of answers) {
            const question = await prisma.questions.findUnique({
                where: { id: answer.questionId },
                include: { questionOptions: true }
            });

            if (question) {
                const selectedOption = question.questionOptions.find((opt) => opt.id === answer.selectedOptionId);
                if (selectedOption?.isCorrect) {
                    obtainedMarks += Number(question.marks);
                }
            }
        }

        // Create submission
        const submission = await prisma.assessment_submission.create({
            data: {
                ...submissionFields,
                obtainedMarks,
                answers: {
                    create: answers.map((answer) => ({
                        questionId: answer.questionId,
                        selectedOptionId: answer.selectedOptionId
                    }))
                }
            },
            include: {
                student: true,
                answers: {
                    include: {
                        question: true,
                        selectedOption: true
                    }
                }
            }
        });

        return submission;
    },

    getSubmissionById: async (id: string) => {
        return prisma.assessment_submission.findUnique({
            where: { id },
            include: {
                student: true,
                moduleAssessment: true,
                finalAssessment: true,
                answers: {
                    include: {
                        question: true,
                        selectedOption: true
                    }
                }
            }
        });
    },

    getSubmissionsByAssessment: async (assessmentId: string, assessmentType: 'module' | 'final') => {
        return prisma.assessment_submission.findMany({
            where: assessmentType === 'module' ? { moduleAssessmentId: assessmentId } : { finalAssessmentId: assessmentId },
            include: {
                student: true,
                answers: {
                    include: {
                        question: true,
                        selectedOption: true
                    }
                }
            }
        });
    },

    getSubmissionsByStudent: async (studentId: number) => {
        return prisma.assessment_submission.findMany({
            where: { studentId },
            include: {
                moduleAssessment: true,
                finalAssessment: true,
                answers: {
                    include: {
                        question: true,
                        selectedOption: true
                    }
                }
            }
        });
    }
};
