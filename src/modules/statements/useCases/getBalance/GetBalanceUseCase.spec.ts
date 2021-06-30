import { GetBalanceUseCase } from './GetBalanceUseCase';
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";


let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Get Balance", () => {
    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    });

    it("should be able to get balance use case", async () => {

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


        const balance = await getBalanceUseCase.execute({
            user_id: statement.user_id
        });

        console.log(balance);

        expect(balance.balance).toBe(10);
    });
});
