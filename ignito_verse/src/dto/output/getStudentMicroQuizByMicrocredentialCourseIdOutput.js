/**
 * OUTPUT PARAMETER FILE: Get Student Micro Quiz By Microcredential Course Id Output DTO Parser
 * Parses response data for GetStudentMicroQuizByMicrocredentialCourseId POST request.
 * 
 * @param {object} rawJson - Raw JSON response from API
 * @param {number} status - HTTP status code
 * @returns {object} Formatted output DTO with quiz metadata and all question/option collections
 */
export function parseGetStudentMicroQuizByMicrocredentialCourseIdOutput(rawJson = {}, status = 200) {
    const isHttpOk = status >= 200 && status < 300;
    const isSuccess = Boolean(rawJson?.isSuccess ?? rawJson?.IsSuccess ?? isHttpOk);

    // Normalize Questions
    const questions = Array.isArray(rawJson?.questions || rawJson?.Questions)
        ? (rawJson?.questions || rawJson?.Questions).map(q => ({
            questionId: q?.questionsId ?? q?.QuestionsId ?? q?.questionId ?? q?.QuestionId ?? 0,
            questionsId: q?.questionsId ?? q?.QuestionsId ?? q?.questionId ?? q?.QuestionId ?? 0,
            quizId: q?.quizId ?? q?.QuizId ?? 0,
            degreeQuestionType: q?.degreeQuestionType ?? q?.DegreeQuestionType ?? 0,
            title: q?.title || q?.Title || '',
            questionText: q?.questionText || q?.QuestionText || '',
            questionFeedback: q?.questionFeedback || q?.QuestionFeedback || '',
            hint: q?.hint || q?.Hint || '',
            shortDescription: q?.shortDescription || q?.ShortDescription || '',
            enumeration: q?.enumeration || q?.Enumeration || '',
            customWeights: q?.customWeights || q?.CustomWeights || '',
            points: Number(q?.points ?? q?.Points ?? 1),
            displayOrder: q?.displayOrder ?? q?.DisplayOrder ?? 0,
            imageUrl: q?.imageUrl || q?.ImageUrl || '',
            difficulty: q?.difficulty ?? q?.Difficulty ?? 0,
            alternativeText: q?.alternativeText || q?.AlternativeText || '',
            randomizeAnswers: Boolean(q?.randomizeAnswers ?? q?.RandomizeAnswers ?? false),
            howPointAssignedToBlanks: q?.howPointAssignedToBlanks || q?.HowPointAssignedToBlanks || ''
        }))
        : [];

    // Normalize Answer Options
    const answerOptions = Array.isArray(rawJson?.answerOptions || rawJson?.AnswerOptions)
        ? (rawJson?.answerOptions || rawJson?.AnswerOptions).map(opt => ({
            answerId: opt?.answerId ?? opt?.AnswerId ?? 0,
            questionId: opt?.questionId ?? opt?.QuestionId ?? 0,
            text: opt?.text || opt?.Text || '',
            isCorrect: Boolean(opt?.isCorrect ?? opt?.IsCorrect ?? false),
            displayOrder: opt?.displayOrder ?? opt?.DisplayOrder ?? 0,
            answerFeedback: opt?.answerFeedback || opt?.AnswerFeedback || ''
        }))
        : [];

    // Normalize Question Text Components
    const questionTextComponents = Array.isArray(rawJson?.questionTextComponents || rawJson?.QuestionTextComponents)
        ? (rawJson?.questionTextComponents || rawJson?.QuestionTextComponents).map(comp => ({
            questionTextComponentId: comp?.questionTextComponentId ?? comp?.QuestionTextComponentId ?? 0,
            questionId: comp?.questionId ?? comp?.QuestionId ?? 0,
            componentType: comp?.componentType || comp?.ComponentType || '',
            content: comp?.content || comp?.Content || '',
            blankPoints: comp?.blankPoints ?? comp?.BlankPoints ?? 0,
            displayOrder: comp?.displayOrder ?? comp?.DisplayOrder ?? 0
        }))
        : [];

    // Normalize Blank Answers
    const blankAnswers = Array.isArray(rawJson?.blankAnswers || rawJson?.BlankAnswers)
        ? (rawJson?.blankAnswers || rawJson?.BlankAnswers).map(b => ({
            blankAnswerId: b?.blankAnswerId ?? b?.BlankAnswerId ?? 0,
            questionId: b?.questionId ?? b?.QuestionId ?? 0,
            blankNumber: b?.blankNumber ?? b?.BlankNumber ?? 0,
            correctAnswer: b?.correctAnswer || b?.CorrectAnswer || '',
            points: b?.points ?? b?.Points ?? 0
        }))
        : [];

    // Normalize Matching Questions & Choices & Pairs
    const matchingQuestions = Array.isArray(rawJson?.matchingQuestions || rawJson?.MatchingQuestions)
        ? (rawJson?.matchingQuestions || rawJson?.MatchingQuestions).map(m => ({
            matchingQuestionId: m?.matchingQuestionId ?? m?.MatchingQuestionId ?? 0,
            questionId: m?.questionId ?? m?.QuestionId ?? 0,
            promptText: m?.promptText || m?.PromptText || '',
            promptIndex: m?.promptIndex ?? m?.PromptIndex ?? 0
        }))
        : [];

    const matchingPairs = Array.isArray(rawJson?.matchingPairs || rawJson?.MatchingPairs)
        ? (rawJson?.matchingPairs || rawJson?.MatchingPairs).map(p => ({
            pairId: p?.pairId ?? p?.PairId ?? 0,
            questionId: p?.questionId ?? p?.QuestionId ?? 0,
            leftItem: p?.leftItem || p?.LeftItem || '',
            rightItem: p?.rightItem || p?.RightItem || '',
            displayOrder: p?.displayOrder ?? p?.DisplayOrder ?? 0
        }))
        : [];

    const matchingChoices = Array.isArray(rawJson?.matchingChoices || rawJson?.MatchingChoices)
        ? (rawJson?.matchingChoices || rawJson?.MatchingChoices).map(c => ({
            choiceId: c?.choiceId ?? c?.ChoiceId ?? 0,
            questionId: c?.questionId ?? c?.QuestionId ?? 0,
            choiceText: c?.choiceText || c?.ChoiceText || '',
            displayOrder: c?.displayOrder ?? c?.DisplayOrder ?? 0
        }))
        : [];

    // Normalize Ordering Questions & Items
    const orderingQuestions = Array.isArray(rawJson?.orderingQuestions || rawJson?.OrderingQuestions)
        ? (rawJson?.orderingQuestions || rawJson?.OrderingQuestions).map(oq => ({
            orderingQuestionId: oq?.orderingQuestionId ?? oq?.OrderingQuestionId ?? 0,
            questionId: oq?.questionId ?? oq?.QuestionId ?? 0
        }))
        : [];

    const orderingItems = Array.isArray(rawJson?.orderingItems || rawJson?.OrderingItems)
        ? (rawJson?.orderingItems || rawJson?.OrderingItems).map(o => ({
            itemId: o?.itemId ?? o?.ItemId ?? 0,
            questionId: o?.questionId ?? o?.QuestionId ?? 0,
            itemText: o?.itemText || o?.ItemText || '',
            correctOrder: o?.correctOrder ?? o?.CorrectOrder ?? 0,
            displayOrder: o?.displayOrder ?? o?.DisplayOrder ?? 0
        }))
        : [];

    // Normalize Short Answer Questions
    const shortAnswerQuestions = Array.isArray(rawJson?.shortAnswerQuestions || rawJson?.ShortAnswerQuestions)
        ? (rawJson?.shortAnswerQuestions || rawJson?.ShortAnswerQuestions).map(sa => ({
            shortAnswerId: sa?.shortAnswerId ?? sa?.ShortAnswerId ?? 0,
            questionId: sa?.questionId ?? sa?.QuestionId ?? 0,
            expectedAnswer: sa?.expectedAnswer || sa?.ExpectedAnswer || '',
            isCaseSensitive: Boolean(sa?.isCaseSensitive ?? sa?.IsCaseSensitive ?? false)
        }))
        : [];

    // Normalize Arithmetic & Variables
    const arithmeticQuestions = Array.isArray(rawJson?.arithmeticQuestions || rawJson?.ArithmeticQuestions)
        ? (rawJson?.arithmeticQuestions || rawJson?.ArithmeticQuestions).map(ar => ({
            arithmeticId: ar?.arithmeticId ?? ar?.ArithmeticId ?? 0,
            questionId: ar?.questionId ?? ar?.QuestionId ?? 0,
            formula: ar?.formula || ar?.Formula || '',
            tolerance: ar?.tolerance ?? ar?.Tolerance ?? 0,
            unit: ar?.unit || ar?.Unit || ''
        }))
        : [];

    const arithmeticVariables = Array.isArray(rawJson?.arithmeticVariables || rawJson?.ArithmeticVariables)
        ? (rawJson?.arithmeticVariables || rawJson?.ArithmeticVariables).map(v => ({
            variableId: v?.variableId ?? v?.VariableId ?? 0,
            questionId: v?.questionId ?? v?.QuestionId ?? 0,
            variableName: v?.variableName || v?.VariableName || '',
            minValue: v?.minValue ?? v?.MinValue ?? 0,
            maxValue: v?.maxValue ?? v?.MaxValue ?? 0,
            generatedValue: v?.generatedValue ?? v?.GeneratedValue ?? 0
        }))
        : [];

    // Normalize Significant Figures
    const significantFiguresQuestions = Array.isArray(rawJson?.significantFiguresQuestions || rawJson?.SignificantFiguresQuestions)
        ? (rawJson?.significantFiguresQuestions || rawJson?.SignificantFiguresQuestions).map(sf => ({
            significantFigureId: sf?.significantFigureId ?? sf?.SignificantFigureId ?? 0,
            questionId: sf?.questionId ?? sf?.QuestionId ?? 0,
            formula: sf?.formula || sf?.Formula || '',
            tolerance: sf?.tolerance ?? sf?.Tolerance ?? 0,
            significantDigits: sf?.significantDigits ?? sf?.SignificantDigits ?? 0
        }))
        : [];

    const significantFiguresVariables = Array.isArray(rawJson?.significantFiguresVariables || rawJson?.SignificantFiguresVariables)
        ? (rawJson?.significantFiguresVariables || rawJson?.SignificantFiguresVariables).map(sv => ({
            variableId: sv?.variableId ?? sv?.VariableId ?? 0,
            questionId: sv?.questionId ?? sv?.QuestionId ?? 0,
            variableName: sv?.variableName || sv?.VariableName || '',
            minValue: sv?.minValue ?? sv?.MinValue ?? 0,
            maxValue: sv?.maxValue ?? sv?.MaxValue ?? 0,
            generatedValue: sv?.generatedValue ?? sv?.GeneratedValue ?? 0
        }))
        : [];

    // Normalize Multi-Short Answer
    const multiShortAnswers = Array.isArray(rawJson?.multiShortAnswers || rawJson?.MultiShortAnswers)
        ? (rawJson?.multiShortAnswers || rawJson?.MultiShortAnswers).map(ms => ({
            multiShortAnswerId: ms?.multiShortAnswerId ?? ms?.MultiShortAnswerId ?? 0,
            questionId: ms?.questionId ?? ms?.QuestionId ?? 0,
            answerText: ms?.answerText || ms?.AnswerText || '',
            blankIndex: ms?.blankIndex ?? ms?.BlankIndex ?? 0
        }))
        : [];

    const multiShortAnswerInputBoxes = Array.isArray(rawJson?.multiShortAnswerInputBoxes || rawJson?.MultiShortAnswerInputBoxes)
        ? (rawJson?.multiShortAnswerInputBoxes || rawJson?.MultiShortAnswerInputBoxes)
        : [];

    const writtenResponseSettings = Array.isArray(rawJson?.writtenResponseSettings || rawJson?.WrittenResponseSettings)
        ? (rawJson?.writtenResponseSettings || rawJson?.WrittenResponseSettings)
        : [];

    // Normalize Likert Scales & Statements
    const likertQuestions = Array.isArray(rawJson?.likertQuestions || rawJson?.LikertQuestions)
        ? (rawJson?.likertQuestions || rawJson?.LikertQuestions).map(lq => ({
            likertQuestionId: lq?.likertQuestionId ?? lq?.LikertQuestionId ?? 0,
            questionId: lq?.questionId ?? lq?.QuestionId ?? 0,
            scaleType: lq?.scaleType || lq?.ScaleType || ''
        }))
        : [];

    const likertScale = Array.isArray(rawJson?.likertScale || rawJson?.LikertScale)
        ? (rawJson?.likertScale || rawJson?.LikertScale).map(ls => ({
            scaleId: ls?.scaleId ?? ls?.ScaleId ?? 0,
            questionId: ls?.questionId ?? ls?.QuestionId ?? 0,
            scaleValue: ls?.scaleValue ?? ls?.ScaleValue ?? 0,
            scaleLabel: ls?.scaleLabel || ls?.ScaleLabel || '',
            displayOrder: ls?.displayOrder ?? ls?.DisplayOrder ?? 0
        }))
        : [];

    const likertStatements = Array.isArray(rawJson?.likertStatements || rawJson?.LikertStatements)
        ? (rawJson?.likertStatements || rawJson?.LikertStatements).map(ls => ({
            statementId: ls?.statementId ?? ls?.StatementId ?? 0,
            questionId: ls?.questionId ?? ls?.QuestionId ?? 0,
            statementText: ls?.statementText || ls?.StatementText || '',
            statementIndex: ls?.statementIndex ?? ls?.StatementIndex ?? 0
        }))
        : [];

    return {
        success: isSuccess,
        isSuccess,
        quizId: rawJson?.quizId ?? rawJson?.QuizId ?? 0,
        quizName: rawJson?.quizName || rawJson?.QuizName || '',
        quizDescription: rawJson?.quizDescription || rawJson?.QuizDescription || '',
        attemptId: rawJson?.attemptId ?? rawJson?.AttemptId ?? 0,
        attemptsAllowed: Number(rawJson?.attemptsAllowed ?? rawJson?.AttemptsAllowed ?? 0),
        remainingAttempts: Number(rawJson?.remainingAttempts ?? rawJson?.RemainingAttempts ?? 0),
        attemptsDone: Number(rawJson?.attemptsDone ?? rawJson?.AttemptsDone ?? 0),
        currentAttemptNumber: Number(rawJson?.currentAttemptNumber ?? rawJson?.CurrentAttemptNumber ?? 1),
        timeLimit: Number(rawJson?.timeLimit ?? rawJson?.TimeLimit ?? 0),
        allowHints: Boolean(rawJson?.allowHints ?? rawJson?.AllowHints ?? false),
        headerDescription: rawJson?.headerDescription || rawJson?.HeaderDescription || '',
        footerDescription: rawJson?.footerDescription || rawJson?.FooterDescription || '',
        message: rawJson?.message || rawJson?.Message || '',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || '',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || 0,

        // Collections
        questions,
        answerOptions,
        questionTextComponents,
        blankAnswers,
        matchingQuestions,
        matchingPairs,
        matchingChoices,
        orderingQuestions,
        orderingItems,
        writtenResponseSettings,
        shortAnswerQuestions,
        arithmeticQuestions,
        arithmeticVariables,
        significantFiguresQuestions,
        significantFiguresVariables,
        multiShortAnswers,
        multiShortAnswerInputBoxes,
        likertQuestions,
        likertScale,
        likertStatements,
        status,
        rawData: rawJson
    };
}

export function parseGetStudentMicroQuizByMicrocredentialCourseIdErrorOutput(rawJson = {}, status = 500) {
    return {
        success: false,
        isSuccess: false,
        quizId: 0,
        quizName: '',
        quizDescription: '',
        attemptId: 0,
        attemptsAllowed: 0,
        remainingAttempts: 0,
        attemptsDone: 0,
        currentAttemptNumber: 0,
        timeLimit: 0,
        allowHints: false,
        headerDescription: '',
        footerDescription: '',
        message: rawJson?.message || rawJson?.Message || 'Failed to fetch quiz preview data',
        errorDescription: rawJson?.errorDescription || rawJson?.ErrorDescription || rawJson?.error || '',
        errorNo: rawJson?.errorNo || rawJson?.ErrorNo || status,
        questions: [],
        answerOptions: [],
        questionTextComponents: [],
        blankAnswers: [],
        matchingQuestions: [],
        matchingPairs: [],
        matchingChoices: [],
        orderingQuestions: [],
        orderingItems: [],
        writtenResponseSettings: [],
        shortAnswerQuestions: [],
        arithmeticQuestions: [],
        arithmeticVariables: [],
        significantFiguresQuestions: [],
        significantFiguresVariables: [],
        multiShortAnswers: [],
        multiShortAnswerInputBoxes: [],
        likertQuestions: [],
        likertScale: [],
        likertStatements: [],
        status,
        rawData: rawJson
    };
}
