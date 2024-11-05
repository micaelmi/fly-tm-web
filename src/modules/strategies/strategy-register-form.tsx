"use client";

import InputDefault from "@/components/form/input-default";
import TextareaDefault from "@/components/form/textarea-default";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Question, Strategy } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Item {
  movement_id: number;
  description: string;
}

const FormSchema = z.object({
  against_whom: z
    .string()
    .min(1, { message: "Ao mínimo 1 caractere é necessário" }),
  how_it_works: z.string(),
  items: z.array(
    z.object({
      description: z.string(),
      movement_id: z.number(),
    })
  ),
});

export default function StrategyRegisterForm() {
  const [movesForChoose, setMovesForChoose] = useState([
    {
      movement_id: 1,
      movement_description: "Drive",
      movement_image_url: "/mascot-hitting.svg",
    },
    {
      movement_id: 2,
      movement_description: "Chiquita",
      movement_image_url: "/mascot-hitting.svg",
    },
    {
      movement_id: 3,
      movement_description: "Backend",
      movement_image_url: "/mascot-hitting.svg",
    },
  ]);
  const [items, setItems] = useState<Item[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      against_whom: "",
      how_it_works: "",
      items: [],
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };
  return (
    <div className="flex">
      <div>
        <div>
          <Strategy />
          Elabore uma estratégia
        </div>
        <p>
          Ao lado, caso deseje, escolha movimentos coerentes à estratégia
          elaborada e relacione-os
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <InputDefault
              control={form.control}
              name="against_whom"
              label="Contra quem?"
              placeholder="Contra qual tipo de jogador essa estratégia é interessante?"
            />
            <TextareaDefault
              control={form.control}
              name="how_it_works"
              label="Como funciona?"
              placeholder="Descreva quais movimentos devem ser usados e em qual sequência. Considerando também destacar os contextos apropriados para o uso dessa estratégia."
            />
            <Button>Enviar</Button>
          </form>
        </Form>
      </div>

      <div>
        <h1>Movimentos</h1>
        <Search pagination={false} placeholder="Buscar..." />
        {movesForChoose.map((move) => {
          return (
            <div key={move.movement_id}>
              {move.movement_id}
              <div>
                {move.movement_description}
                <Question />
              </div>
              <Image
                src={move.movement_image_url}
                width={100}
                height={100}
                className="aspect-square"
                alt="Imagem do movimento"
              />
              <Button
                type="button"
                onClick={() => {
                  const newItem = {
                    movement_id: move.movement_id,
                    description: move.movement_description,
                  };
                  setItems([...items, newItem]);
                }}
              >
                Relacionar
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
