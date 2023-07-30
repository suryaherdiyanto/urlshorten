import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Redirect } from './entities/redirects.entity';
import { randomString } from '../str.utils';

@Injectable()
export class RedirectsService {
    constructor(@InjectRepository(Redirect) private repository: Repository<Redirect>) {}

    findByReferrer(referrer: string) {
        return this.repository.findOneBy({ referrer });
    }

    create(full_url: string) {
        const referrer = randomString(4);
        const redirect = this.repository.create({ full_url, referrer });

        return this.repository.save(redirect);
    }
}
