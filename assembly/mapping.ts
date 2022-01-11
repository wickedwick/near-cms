import { near, BigInt, log } from "@graphprotocol/graph-ts";
import { Content } from "../generated/schema";

// TODO: Get more info on theGraph and how to use it
export function handleContentReceipt(receipt: near.ReceiptWithOutcome): void {
  log.info("Receipt:", receipt)
  const actions = receipt.receipt.actions
  for (let i = 0; i < actions.length; i++) {
    handleAction(actions[i], receipt.receipt, receipt.block.header);
  }
}

export function handleBlock(block: near.Block): void {
  log.info("Block:", block)
  const chunks = block.chunks
}

//submit
function handleAction(
  action: near.ActionValue,
  receipt: near.ActionReceipt,
  blockHeader: near.BlockHeader
): void {
  log.info("Action:", action)
  if (action.kind != near.ActionKind.FUNCTION_CALL) {
    log.info("Early return: {}", ["Not a function call"]);
    return;
  }

  const functionCall = action.toFunctionCall()
  if (functionCall)
}