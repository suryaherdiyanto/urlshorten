import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redirect } from './entities/redirects.entity';

@Injectable()
export class RedirectsService {
    constructor(@InjectRepository(Redirect) private repository: Repository<Redirect>) {}
}
