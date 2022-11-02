// const path = require("path");

const counter = require("../models/subcounter");
const BioQAModel = require("../models/Biology/qaModel");
const ChemQAModel = require("../models/Chemistry/qaModel");
const MathQAModel = require("../models/Math/qaModel");
const PhyQAModel = require("../models/Physics/qaModel");
const HttpError = require("../models/http-error");

const subjects = ["phy", "chem", "bio", "math"]; //fetch from database\

const addSubjectQuestion = async (model, id, question, answer) => {
  const qamodel = new model({
    id,
    question,
    answer,
  });
  try {
    await qamodel.save();

    return qamodel;
  } catch (err) {
    console.log(err);
    next(new HttpError("not found", 404));
    return 0;
  }
};

const addQuestion = (req, res, next) => {
  const question = req.body.question;
  const answer = req.body.answer;
  const sub = req.params.sub.toLowerCase();

  if (subjects.includes(sub)) {
    counter.findOneAndUpdate(
      { subject: sub },
      { $inc: { counter: 1 } },
      { new: true },
      async (err, cd) => {
        let autoid;
        if (cd == null) {
          const newval = new counter({ subject: sub, counter: 1, daily: 1 });
          newval.save();
          autoid = 1;
        } else {
          autoid = cd.counter;
        }
        let success;
        switch (sub) {
          case subjects[0]:
            success = await addSubjectQuestion(
              PhyQAModel,
              autoid,
              question,
              answer
            );
            break;
          case subjects[1]:
            success = await addSubjectQuestion(
              ChemQAModel,
              autoid,
              question,
              answer
            );

            break;
          case subjects[2]:
            success = await addSubjectQuestion(
              BioQAModel,
              autoid,
              question,
              answer
            );

            break;
          case subjects[3]:
            success = await addSubjectQuestion(
              MathQAModel,
              autoid,
              question,
              answer
            );

            break;
        }

        if (success) {
          res.status(201).json({ model: success });
        } else {
          console.log("error");
          next(new HttpError("error occured ", 404));
        }
      }
    );
  } else {
    next(new HttpError("Subject not found", 404));
    //handle error
  }
};
const findquestion = async (model, id) => {
  const question = await model.findOne({ id: id });
  if (!question.length) {
    next(new HttpError("question not found", 404));
    return;
  }
  return question;
};
const getdailyquestion = async (req, res, next) => {
  const sub = req.params.sub;
  counter.findOne({ subject: sub }, async (err, cd) => {
    if (cd == null) {
      next(new HttpError("daily counter not found", 404));
      return;
    } else {
      if (subjects.includes(sub)) {
        let question;
        switch (sub) {
          case subjects[0]:
            question = await findquestion(PhyQAModel, cd.daily);
            break;
          case subjects[1]:
            question = await findquestion(ChemQAModel, cd.daily);
            break;
          case subjects[2]:
            question = await findquestion(BioQAModel, cd.daily);
            break;
          case subjects[3]:
            question = await findquestion(MathQAModel, cd.daily);
            // const mathquestion = await MathQAModel.findOne({ id: cd.daily });
            // res.status(200).json({ question: mathquestion });
            break;
        }
        if (question) {
          res.status(200).json({ question: question });
        } else {
          console.log("err");
          next(new HttpError("not found", 404));
        }
      }
    }
  });
};
const updatedaily = (req, res, next) => {
  const sub = req.params.sub;
  if (subjects.includes(sub)) {
    counter.findOneAndUpdate(
      { subject: sub },
      { $inc: { daily: 1 } },
      { new: true },
      (err, cd) => {
        if (cd == null) {
          const newval = new counter({ subject: sub, counter: 1, daily: 1 });
          newval.save();
          autoid = 1;
        } else {
          if (cd.daily > cd.counter) {
            cd.daily = cd.counter;
            cd.save();
            next(new HttpError("no further questions", 404));
            return;
          }
        }
        res.status(200).json({ message: "updated daily pointer" });
      }
    );
  } else {
    next(new HttpError("not found", 404));
  }
};

const getqalist = async (req, res, next) => {
  const sub = req.params.sub;
  if (subjects.includes(sub)) {
    switch (sub) {
      case subjects[0]:
        const phyquestion = await PhyQAModel.find({});
        res.status(200).json({ question: phyquestion });
        break;
      case subjects[1]:
        const chemquestion = await ChemQAModel.find({});
        res.status(200).json({ question: chemquestion });
        break;
      case subjects[2]:
        const bioquestion = await BioQAModel.find({});
        res.status(200).json({ question: bioquestion });
        break;
      case subjects[3]:
        const mathquestion = await MathQAModel.find({});
        res.status(200).json({ question: mathquestion });
        break;
    }
  } else {
    next(new HttpError("not found", 404));
    return;
  }
};

const getqa = async (req, res, next) => {
  const id = +req.params.id;
  const sub = req.params.sub;
  if (subjects.includes(sub)) {
    switch (sub) {
      case subjects[0]:
        const phyquestion = await PhyQAModel.find({ id: id });
        if (!phyquestion.length) {
          next(new HttpError("not found", 404));
          return;
        }
        res.status(200).json({ question: phyquestion });
        break;
      case subjects[1]:
        const chemquestion = await ChemQAModel.find({ id: id });
        if (!chemquestion.length) {
          next(new HttpError("not found", 404));
          return;
        }
        res.status(200).json({ question: chemquestion });
        break;
      case subjects[2]:
        const bioquestion = await BioQAModel.find({ id: id });
        if (!bioquestion.length) {
          next(new HttpError("not found", 404));
          return;
        }
        res.status(200).json({ question: bioquestion });
        break;
      case subjects[3]:
        const mathquestion = await MathQAModel.find({ id: id });
        if (!mathquestion.length) {
          next(new HttpError("not found", 404));
          return;
        }
        res.status(200).json({ question: mathquestion });
        break;
    }
  }
};
const deletefunc = async (model, id, sub) => {
  const question = await model
    .findOne({ id: id }, (err, cd) => {
      if (cd != null) {
        cd.remove();
        counter.findOneAndUpdate(
          { subject: sub },
          { $inc: { counter: -1 } },
          { new: true },
          (err, num) => {
            // if (num.counter == 0) {
            //   return res.status(200).json({ message: "counter reached 0" });
            // }
          }
        );
        return 1;
      } else return 0;
    })
    .clone()
    .catch(function (err) {
      console.log(err);
      next(new HttpError("not found", 404));
    });
  return question;
};
const deleteqa = async (req, res, next) => {
  const id = +req.params.id;
  const sub = req.params.sub;
  if (subjects.includes(sub)) {
    let success;
    switch (sub) {
      case subjects[0]:
        success = await deletefunc(PhyQAModel, id, sub);
        break;
      case subjects[1]:
        success = await deletefunc(ChemQAModel, id, sub);
        break;
      case subjects[2]:
        success = await deletefunc(BioQAModel, id, sub);
        break;
      case subjects[3]:
        success = await deletefunc(MathQAModel, id, sub);

        break;
    }
    if (success) {
      console.log(success);
      res.status(200).json({ message: "deleted" });
    } else {
      console.log("err");
      next(new HttpError("not found", 404));
    }
  }
};
const updatefunc = async (model, id, question, answer) => {
  const modify = await model
    .findOne({ id: id }, async (err, cd) => {
      if (cd != null) {
        cd.question = question;
        cd.answer = answer;
        await cd.save();
      }
    })
    .clone()
    .catch(function (err) {
      console.log(err);
    });

  return modify;
};
const updateqabyid = async (req, res, next) => {
  const question = req.body.question;
  const answer = req.body.answer;
  const id = +req.params.id;
  const sub = req.params.sub;
  if (subjects.includes(sub)) {
    let success;
    switch (sub) {
      case subjects[0]:
        success = await updatefunc(PhyQAModel, id, question, answer);

        break;
      case subjects[1]:
        success = await updatefunc(ChemQAModel, id, question, answer);
        break;
      case subjects[2]:
        success = await updatefunc(BioQAModel, id, question, answer);
        break;
      case subjects[3]:
        success = await updatefunc(MathQAModel, id, question, answer);
        break;
    }
    if (success) {
      res.status(200).json({ message: "updated", question: success });
    } else {
      console.log("err");
      next(new HttpError("not found", 404));
    }
  } else {
    next(new HttpError("Subject not found", 404));
  }
};

// exports.adminpage = adminpage;
exports.addQuestion = addQuestion;
exports.getqalist = getqalist;
exports.getqa = getqa;
exports.deleteqa = deleteqa;
exports.updateqabyid = updateqabyid;
exports.updatedaily = updatedaily;
exports.getdailyquestion = getdailyquestion;
