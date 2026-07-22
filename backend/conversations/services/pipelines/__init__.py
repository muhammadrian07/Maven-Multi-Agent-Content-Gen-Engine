from conversations.services.pipelines.ads import AdsPipelineHandler
from conversations.services.pipelines.base import BasePipelineHandler
from conversations.services.pipelines.blog import BlogPipelineHandler
from conversations.services.pipelines.video import VideoPipelineHandler

_HANDLERS: dict[str, BasePipelineHandler] = {
    "blog": BlogPipelineHandler(),
    "video": VideoPipelineHandler(),
    "ads": AdsPipelineHandler(),
}


def get_handler(pipeline: str) -> BasePipelineHandler:
    try:
        return _HANDLERS[pipeline]
    except KeyError as exc:
        raise ValueError(f"Unknown pipeline: {pipeline}") from exc
