import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@privana/ui/components/input-group";
import { Search } from "lucide-react";

export function CreatorSearch() {
  return (
    <search>
      <form action="/explore">
        <InputGroup className="h-11 rounded-full bg-muted/60">
          <InputGroupInput
            aria-label="Buscar criadores"
            autoComplete="off"
            name="q"
            placeholder="Buscar criadores"
            type="search"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton aria-label="Buscar" type="submit">
              <Search />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </search>
  );
}
