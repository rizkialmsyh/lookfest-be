import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateReplyDto } from './dto/update-reply.input.dto';
import { ReplyRepository } from './reply.repository';
import { ReplyListResponseDto, ReplyResponseDto } from './dto/reply-response.dto';

@Injectable()
export class ReplyService {
  constructor(private readonly replyRepository: ReplyRepository) {}

  async findAll(): Promise<ReplyListResponseDto> {
    const replyData = await this.replyRepository.getAllReply();

    if (!replyData) {
      throw new InternalServerErrorException('Reply not found');
    }

    return {
      message: 'success get all reply',
      replies: replyData,
    };
  }

  async create( userId: string, reviewId: string, replyText: string ) {
    const checkReply = await this.replyRepository.getReplyByUserAndReviewId(
      userId,
      reviewId
    );
    if (checkReply.length > 0) {
      return { 
        status: 400,
        message: 'Reply already exists' 
      };
    }

    const reply = await this.replyRepository.createReply({
      userId,
      reviewId,
      reply: replyText,
    });

    if (!reply) {
      return { 
        status: 400,
        message: 'Reply already exists' 
      };
    }

    return { message: 'Reply created successfully' };
  }

  async findOne(id: string): Promise<ReplyResponseDto> | null {
    const review = await this.replyRepository.getReplybyId(id);
    if (!review) {
      throw new BadRequestException('Review not found');
    }

    return {
      message: 'success get review',
      ...review
    }
  }

  async update(id: string, updateReplyDto: UpdateReplyDto) {
    return await this.replyRepository.updateReply(id, updateReplyDto);
  }

  async remove(id: string) {
    return await this.replyRepository.deleteReply(id);
  }
}
