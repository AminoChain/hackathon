CREATE TABLE contracts (
    id BIGSERIAL,
    contract_address TEXT,
    name TEXT,
    PRIMARY Key("id")
);

CREATE TABLE tokens (
	contract_id  bigint,
    tokennumber bigint,
    deliverystatus TEXT,
	primary key ("contract_id","tokennumber")
	
);

create index on "contracts" ("id"); 
create index on "contracts" ("contract_address");

create index on "tokens" ("contract_id"); 
create index on "tokens" ("tokennumber");

Alter TABLE "tokens" ADD FOREIGN KEY ("contract_id") REFERENCES "contracts" ("id");