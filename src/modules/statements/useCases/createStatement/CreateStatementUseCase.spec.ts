import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Create Statement", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    });

    it("should be able to create a new statement", async () => {

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

        const statement = {
            user_id: userCreated.id,
            type: OperationType.DEPOSIT,
            amount: 10,
            description: "Test Statement",
        };

        const statementCreated = await createStatementUseCase.execute({
            user_id: statement.user_id,
            type: statement.type,
            amount: statement.amount,
            description: statement.description,
        });

        const statementUserCreated = await inMemoryStatementsRepository.findStatementOperation({
            statement_id: statementCreated.id,
            user_id: statement.user_id,
        });

        expect(statementCreated).toHaveProperty("id");
    });
});
