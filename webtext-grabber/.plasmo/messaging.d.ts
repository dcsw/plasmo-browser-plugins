
import "@plasmohq/messaging"

interface MmMetadata {
	"get-manifest" : {}
	"hash-tx" : {}
	"open-extension" : {}
	"math/add" : {}
}

interface MpMetadata {
	"mail" : {}
}

declare module "@plasmohq/messaging" {
  interface MessagesMetadata extends MmMetadata {}
  interface PortsMetadata extends MpMetadata {}
}
