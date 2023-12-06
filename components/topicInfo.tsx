import Image from "next/image";
import { useState, useEffect } from "react";
import { IGraphState, IDispatch } from "react-dag-editor";
import { usePathname } from "next/navigation";
import { getTopicInfo, setTopicInfo } from "@/lib/data/storage";
import axios from "axios";
// info panel to open and close when clicking on a node
// displays how the node topic relates to its source node and learning resources
export default function TopicInfo({
  state,
  dispatch,
}: {
  state: IGraphState;
  dispatch: IDispatch;
}) {
  const [info, setInfo] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [source, setSource] = useState<any | null>(null);
  const path = usePathname();
  const [graphId, setGraphId] = useState<string | null>(null);

  useEffect(() => {
    const id = path.split("/")[2];
    setGraphId(id);
  }, [path]);

  useEffect(() => {
    const nodeId = state?.data.present.selectedNodes.values().next().value;
    if (!nodeId) return;
    const node = getNodeById(nodeId, state);
    const source = getNodeParent(node, state);
    async function fetchData() {
      const topicInfo = getTopicInfo(graphId as string, nodeId);
      // if topic info does not exist for this node generate it
      if (!topicInfo) {
        const question = `what is the relationship between ${source?.inner.name} and ${node?.inner.name}?`;
        const topicInfo = await fetchTopicInfo(question);
        // extract sources
        const idx = topicInfo.indexOf("SOURCES");
        let info = {
          info: topicInfo.slice(0, idx),
          links: topicInfo.match(
            /(?:https?|ftp):\/\/[\n\S]+?(?=[,.?!;:"-]?(\s|$))|(?:www\.)[\n\S]+?(?=[,.?!;:"-]?(\s|$))/gi
          ),
        };
        setTopicInfo(graphId as string, nodeId, info.info, info.links);
        setInfo(info);
      } else setInfo(topicInfo);
    }
    if (state) fetchData();
    setOpen(true);
    setSelected(node);
    setSource(source);
  }, [graphId, state?.data.present.selectedNodes]);

  return (
    <div
      className={`flex flex-col ${
        open ? "flex-1" : "flex-0"
      } bg-white border-l-4 border-blue-400 rounded-lg p-8 transition-all text-slate-800`}
    >
      <button
        className={`flex justify-center rounded-full w-12 h-12 p-1 hover:bg-gray-200 transition-all ${
          !open && "rotate-180"
        }`}
        onClick={() => setOpen(!open)}
      >
        <Image
          src="/close-panel.svg"
          width={36}
          height={36}
          alt="close-panel"
        />
      </button>
      {info && open && (
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-y-4">
            <p className="font-semibold text-4xl">
              How {selected.inner.name} relates to {source.inner.name}
            </p>
            <p className="text-xl w-5/6">{info.info}</p>
          </div>
          <div className="flex flex-col gap-y-4">
            <p className="font-semibold text-4xl">Learning Resources</p>
            {info.links?.map((link: string) => {
              return (
                <a
                  key={link}
                  className="text-blue-400 hover:text-blue-600"
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

async function fetchTopicInfo(question: string) {
  let form = new FormData();
  form.append("question", question);
  form.append("deployment", "pollyfill-choaq-topic-info");
  const res = await axios.post(`/info`, form);
  return res.data;
}

function getNodeById(id: string, state: IGraphState) {
  return state.data.present.nodes.find((node) => node.id === id);
}

function getNodeParent(node: any, state: IGraphState) {
  const edge = state.data.present.edges.find((edge) => edge.target === node.id);
  if (!edge) return null;
  const id = edge.source;
  return getNodeById(id, state);
}
