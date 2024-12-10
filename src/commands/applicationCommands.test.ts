import { ApplicationCommandType } from "discord.js";
import getAllApplicationCommands from "./applicationCommands";

const nameRegex = /^[-_\p{Ll}\p{N}]{1,32}$/u;
const nameRegexMenus = /^[-_\p{L}\p{N} ]{1,32}$/ui;
const choiceRegex = /^.{1,100}$/u;
const descriptionRegex = /^.{1,100}$/u;

describe.each(getAllApplicationCommands().map(command => [command.name, command] as const))("command %s", (_1, command) => {
  if (command.type === ApplicationCommandType.ChatInput) {
    describe("chat input command", () => {
      it("should have a valid name", () => expect(command.name).toMatch(nameRegex));

      it("should have a valid description", () => expect(command.description).toMatch(descriptionRegex));

      if ("options" in command) {
        describe.each(command.options.map(option => [option.name, option] as const))("option %s", (_2, option) => {
          it("should have a valid name", () => expect(option.name).toMatch(nameRegex));

          it("should have a valid description", () => expect(option.description).toMatch(descriptionRegex));

          if ("choices" in option) {
            describe.each(option.choices.map(choice => [choice.name, choice] as const))("choice %s", (_, choice) => {
              it("should have a valid name", () => expect(choice.name).toMatch(choiceRegex));

              if (typeof choice.value === "string") it("should have a valid description", () => expect(choice.value).toMatch(/^.{1,100}$/u));
            });
          }
          if ("options" in option) {
            describe.each(option.options.map(suboption => ["options" in suboption ? "subgroup" : "subcommand", suboption.name, suboption] as const))("%s %s", (_3, _4, suboption) => {
              it("should have a valid name", () => expect(suboption.name).toMatch(nameRegex));

              it("should have a valid description", () => expect(suboption.description).toMatch(descriptionRegex));

              if ("choices" in suboption) {
                describe.each(suboption.choices.map(choice => [choice.name, choice] as const))("choice %s", (_, choice) => {
                  it("should have a valid name", () => expect(choice.name).toMatch(choiceRegex));

                  if (typeof choice.value === "string") it("should have a valid description", () => expect(choice.value).toMatch(/^.{1,100}$/u));
                });
              }
              if ("options" in suboption) {
                describe.each(suboption.options.map(subsuboption => [subsuboption.name, subsuboption] as const))("subcommand %s", (_5, subsuboption) => {
                  it("should have a valid name", () => expect(subsuboption.name).toMatch(nameRegex));

                  it("should have a valid description", () => expect(subsuboption.description).toMatch(descriptionRegex));

                  if ("choices" in subsuboption) {
                    describe.each(subsuboption.choices.map(choice => [choice.name, choice] as const))("choice %s", (_, choice) => {
                      it("should have a valid name", () => expect(choice.name).toMatch(choiceRegex));

                      if (typeof choice.value === "string") it("should have a valid description", () => expect(choice.value).toMatch(/^.{1,100}$/u));
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    describe("menu input command", () => {
      it("should have a valid name", () => expect(command.name).toMatch(nameRegexMenus));
    });
  }
});
