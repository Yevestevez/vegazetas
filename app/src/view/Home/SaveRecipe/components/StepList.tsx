import StepItem from './StepItem'
import type { Step } from '../../../../types/recipe'

interface StepListProps {
    steps: Step[]
    editStep: string | null
    inputBase: string
    labelBase: string
    inputColor: Record<string, string>
    btnColor: Record<string, string>
    onEditToggle: (stepId: string) => void
    onMoveUp: (stepId: string) => void
    onMoveDown: (stepId: string) => void
    onDelete: (stepId: string) => void
    onEditSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

function StepList({
    steps,
    editStep,
    inputBase,
    labelBase,
    inputColor,
    btnColor,
    onEditToggle,
    onMoveUp,
    onMoveDown,
    onDelete,
    onEditSubmit
}: StepListProps) {
    return (
        <ol className="columns-1 lg:columns-2 2xl:columns-3 lg:gap-6">
            {steps.map((step: Step, index: number) => (
                <StepItem
                    key={index}
                    step={step}
                    index={index}
                    isEditing={editStep === step.id}
                    inputBase={inputBase}
                    labelBase={labelBase}
                    inputColor={inputColor}
                    btnColor={btnColor}
                    onEditToggle={() => onEditToggle(step.id)}
                    onMoveUp={() => onMoveUp(step.id)}
                    onMoveDown={() => onMoveDown(step.id)}
                    onDelete={() => onDelete(step.id)}
                    onEditSubmit={onEditSubmit}
                    isFirst={index === 0}
                    isLast={index === steps.length - 1}
                />
            ))}
        </ol>
    )
}

export default StepList
