import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

let config: TypeOrmModuleOptions = {
    autoLoadEntities: true,
};

switch(process.env.NODE_ENV) {
    case 'dev':
        Object.assign(config, {
            type: 'sqlite',
            database: 'db.sqlite',
            synchronize: true,
        });
        break;
    case 'test':

        Object.assign(config, {
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
        });
        break;
    case 'production':
        const options: TypeOrmModuleOptions = {
            type: 'mysql',
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        };

        Object.assign(options);

        break;
    default:
        throw new Error('Wrong env');
}

export const typeOrmDatabase = () => {
    return TypeOrmModule.forRoot(config);
};