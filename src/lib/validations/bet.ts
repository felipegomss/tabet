import { z } from "zod";

export const betSchema = z.object({
  house: z.string().min(1, "Informe a casa"),
  title: z.string().min(1, "Informe o evento"),
  market: z.string().optional(),
  event_at: z.date().nonoptional("Informe a data do evento"),

  odd: z.number().min(1, "Odd deve ser >= 1"),
  units: z.number().positive("Unidades devem ser > 0"),
  result: z.enum(["pending", "green", "red", "refund", "cashout"]),
});

export type BetFormValues = z.infer<typeof betSchema>;
