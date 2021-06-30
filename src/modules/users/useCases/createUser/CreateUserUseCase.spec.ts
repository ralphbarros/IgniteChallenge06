import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to create a new user", async () => {
        const user = {
            email: "ralph@ralph.com.br",
            name: "ralph",
            password: "1234",
        };

        await createUserUseCase.execute({
            email: user.email,
            name: user.name,
            password: user.password,
        });

        const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

        console.log(userCreated);

        expect(userCreated).toHaveProperty("id");
    });

});
