import { Injectable } from "@nestjs/common";
import { Reply } from "@prisma/client";
import { PrismaService } from "src/libs/prisma/prisma.service";

@Injectable()
export class ReplyRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createReply(data: {
        userId: string;
        reviewId: string;
        reply: string;
    }): Promise<any> {
        return await this.prisma.reply.create({
            data,
        });
    }
    
    async getAllReply() {
        const replies = await this.prisma.reply.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                    include: {
                        profiles: {
                            select: {
                                nickname: true,
                            },
                        },
                    },
                },                
            },
        });

        return replies.map(reply => ({
            ...reply,
            user: {
                id: reply.user.id,
                email: reply.user.email,
                nickname: reply.user.profiles[0]?.nickname || '',
            },
        }));
    }
    
    async getReplybyId(id: string): Promise<any> {
        return await this.prisma.reply.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                    include: {
                        profiles: {
                            select: {
                                nickname: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async getReplyByUserAndReviewId(userId: string, reviewId: string): Promise<Reply[]> {
        return await this.prisma.reply.findMany({
            where: {
                userId,
                reviewId,
            },
        });
    }
    
    async updateReply(id: string, data: any): Promise<any> {
        const updatedData: any = {
            reply: data.reply,
        }
        return await this.prisma.reply.update({
            where: { id },
            data: updatedData,
        });
    }
    
    async deleteReply(id: string): Promise<any> {
        return await this.prisma.reply.delete({
            where: { id },
        });
    }
}